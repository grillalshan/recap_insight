import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { DailyLog as DailyLogType } from '@/types';
import { saveDailyLog, getDailyLogs, deleteDailyLog, formatDate } from '@/utils/storage';
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

  const handleDelete = (logId: string) => {
    deleteDailyLog(logId);
    loadLogs();
    
    // Clear content if we're deleting the currently displayed log
    if (logId === editingId) {
      setContent('');
      setEditingId(null);
    }
    
    toast({
      title: "Log deleted",
      description: "The daily log has been removed.",
    });
  };

  const handleNewLog = () => {
    setSelectedDate(new Date());
    setContent('');
    setEditingId(null);
  };

  const recentLogs = logs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Log</h1>
          <p className="text-muted-foreground mt-1">
            Record your daily work activities and progress
          </p>
        </div>
        <Button onClick={handleNewLog} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          New Log
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main input area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Date selector */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Select Date</h2>
            </div>
            
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
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
            <div className="flex items-center gap-4 mb-4">
              <Edit className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {editingId ? 'Edit Log' : 'New Log'} - {format(selectedDate, 'MMM d, yyyy')}
              </h2>
            </div>
            
            <Textarea
              placeholder="Describe your work activities, achievements, meetings, and progress for today..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleSave} variant="hero">
                <Save className="w-4 h-4 mr-2" />
                Save Log
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent logs sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Logs</h2>
            
            {recentLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No logs yet. Start by creating your first daily log!
              </p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm",
                      log.date === formatDate(selectedDate)
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/20 border-border hover:bg-muted/40"
                    )}
                    onClick={() => setSelectedDate(new Date(log.date + 'T00:00:00'))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {format(new Date(log.date + 'T00:00:00'), 'MMM d, yyyy')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(log.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {log.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyLog;