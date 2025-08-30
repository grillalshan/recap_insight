import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { FileText, Calendar, Sparkles, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DailyLog, WeeklySummary as WeeklySummaryType } from '@/types';
import { getLogsForWeek, saveWeeklySummary, getWeeklySummaries, formatDate, getSettings } from '@/utils/storage';
import { generateWeeklySummary } from '@/utils/openai';
import { cn } from '@/lib/utils';

const WeeklySummary = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [weekLogs, setWeekLogs] = useState<DailyLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [savedSummaries, setSavedSummaries] = useState<WeeklySummaryType[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadWeekData();
    loadSavedSummaries();
  }, [selectedWeek]);

  const loadWeekData = () => {
    const logs = getLogsForWeek(selectedWeek);
    setWeekLogs(logs);
    
    // Check if we have a saved summary for this week
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const weekStartStr = formatDate(weekStart);
    const existingSummary = savedSummaries.find(s => s.weekStart === weekStartStr);
    
    if (existingSummary) {
      setGeneratedSummary(existingSummary.summary);
    } else {
      setGeneratedSummary('');
    }
  };

  const loadSavedSummaries = () => {
    const summaries = getWeeklySummaries();
    setSavedSummaries(summaries);
  };

  const handleGenerateSummary = async () => {
    const settings = getSettings();
    
    if (!settings.openaiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in settings first.",
        variant: "destructive",
      });
      return;
    }

    if (weekLogs.length === 0) {
      toast({
        title: "No logs found",
        description: "Please add some daily logs for this week first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const summary = await generateWeeklySummary(weekLogs, settings.openaiApiKey);
      setGeneratedSummary(summary);
      
      // Save the summary
      const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
      
      const summaryData: WeeklySummaryType = {
        weekStart: formatDate(weekStart),
        weekEnd: formatDate(weekEnd),
        summary,
        generatedAt: new Date().toISOString(),
      };
      
      saveWeeklySummary(summaryData);
      loadSavedSummaries();
      
      toast({
        title: "Summary generated!",
        description: "Your weekly summary has been created and saved.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [key]: true });
      
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const currentWeekSummary = savedSummaries.find(s => s.weekStart === formatDate(weekStart));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Weekly Summary</h1>
          <p className="text-muted-foreground mt-1">
            Generate AI-powered summaries of your weekly work
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main summary area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Week selector */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Select Week</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedWeek}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedWeek(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Weekly logs preview */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Logs for This Week</h2>
              <span className="text-sm text-muted-foreground">({weekLogs.length} entries)</span>
            </div>
            
            {weekLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No logs found for this week. Add some daily logs first.
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {weekLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {format(new Date(log.date + 'T00:00:00'), 'EEEE, MMM d')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {log.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Generate summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Summary</h2>
              </div>
              
              <Button
                onClick={handleGenerateSummary}
                disabled={isGenerating || weekLogs.length === 0}
                variant="hero"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>

            {generatedSummary ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-secondary rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Generated Summary
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(generatedSummary, 'current')}
                      disabled={copiedStates['current']}
                    >
                      {copiedStates['current'] ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {generatedSummary}
                    </p>
                  </div>
                </div>
                
                {currentWeekSummary && (
                  <p className="text-xs text-muted-foreground">
                    Generated on {format(new Date(currentWeekSummary.generatedAt), 'PPp')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Click "Generate Summary" to create an AI-powered weekly report
              </p>
            )}
          </Card>
        </div>

        {/* Saved summaries sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Saved Summaries</h2>
            
            {savedSummaries.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No summaries yet. Generate your first weekly summary!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedSummaries
                  .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
                  .map((summary) => {
                    const weekStartDate = new Date(summary.weekStart + 'T00:00:00');
                    const weekEndDate = new Date(summary.weekEnd + 'T00:00:00');
                    const summaryKey = `summary_${summary.weekStart}`;
                    
                    return (
                      <div
                        key={summary.weekStart}
                        className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d')}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => handleCopyToClipboard(summary.summary, summaryKey)}
                            disabled={copiedStates[summaryKey]}
                          >
                            {copiedStates[summaryKey] ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {summary.summary}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(summary.generatedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;