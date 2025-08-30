import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Save, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { DailyLog as DailyLogType } from '@/types';
import { saveDailyLog, getDailyLogs, formatDate } from '@/utils/storage';
import { cn } from '@/lib/utils';

const DailyLog = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [logs, setLogs] = useState<DailyLogType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    // Load content for selected date
    const dateStr = formatDate(selectedDate);
    const existingLog = logs.find(log => log.date === dateStr);
    if (existingLog) {
      setContent(existingLog.content);
      setEditingId(existingLog.id);
    } else {
      setContent('');
      setEditingId(null);
    }
  }, [selectedDate, logs]);

  const loadLogs = () => {
    const allLogs = getDailyLogs();
    setLogs(allLogs);
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your daily log.",
        variant: "destructive",
      });
      return;
    }

    const dateStr = formatDate(selectedDate);
    const now = new Date().toISOString();
    
    const logData: DailyLogType = {
      id: editingId || `log_${Date.now()}`,
      date: dateStr,
      content: content.trim(),
      createdAt: editingId ? logs.find(l => l.id === editingId)?.createdAt || now : now,
      updatedAt: now,
    };

    saveDailyLog(logData);
    loadLogs();
    
    toast({
      title: editingId ? "Log updated" : "Log saved",
      description: `Your daily log for ${format(selectedDate, 'MMM d, yyyy')} has been saved.`,
    });
  };

  const handleNewLog = () => {
    setSelectedDate(new Date());
    setContent('');
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Log</h1>
          <p className="text-muted-foreground mt-2">
            Record your daily work activities and progress
          </p>
        </div>
        <Button onClick={handleNewLog} variant="outline" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          New Log
        </Button>
      </div>

      {/* Date selector */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Select Date</h2>
        </div>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </Card>

      {/* Content input */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Edit className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">
            {editingId ? 'Edit Log' : 'New Log'} - {format(selectedDate, 'MMM d, yyyy')}
          </h2>
        </div>
        
        <div className="space-y-6">
          <Textarea
            placeholder="Describe your work activities, achievements, meetings, and progress for today..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[250px] resize-none text-base leading-relaxed"
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSave} variant="hero" size="lg">
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Update Log' : 'Save Log'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick tips */}
      <Card className="p-6 bg-muted/20 border-primary/20">
        <h3 className="font-semibold text-foreground mb-3">💡 Tips for effective logging:</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Include specific achievements and completed tasks</li>
          <li>• Mention meetings, decisions, and important communications</li>
          <li>• Note any blockers or challenges encountered</li>
          <li>• Record progress on ongoing projects</li>
        </ul>
      </Card>
    </div>
  );
};

export default DailyLog;