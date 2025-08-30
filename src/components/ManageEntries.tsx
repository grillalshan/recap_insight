import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  FileText, 
  Calendar, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DailyLog as DailyLogType } from '@/types';
import { getDailyLogs, deleteDailyLog } from '@/utils/storage';
import { cn } from '@/lib/utils';

const ManageEntries = () => {
  const [logs, setLogs] = useState<DailyLogType[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<DailyLogType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [selectedLog, setSelectedLog] = useState<DailyLogType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, sortOrder, filterPeriod]);

  const loadLogs = () => {
    const allLogs = getDailyLogs();
    setLogs(allLogs);
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.date.includes(searchTerm)
      );
    }

    // Apply period filter
    if (filterPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (filterPeriod === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (filterPeriod === 'month') {
        cutoffDate.setDate(now.getDate() - 30);
      }
      
      filtered = filtered.filter(log => 
        new Date(log.date) >= cutoffDate
      );
    }

    // Apply sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredLogs(filtered);
  };

  const handleDeleteLog = (logId: string) => {
    deleteDailyLog(logId);
    loadLogs();
    
    toast({
      title: "Entry deleted",
      description: "The daily log entry has been removed.",
    });
  };

  const getStatistics = () => {
    const totalEntries = logs.length;
    const thisWeek = logs.filter(log => {
      const logDate = new Date(log.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length;
    
    const thisMonth = logs.filter(log => {
      const logDate = new Date(log.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return logDate >= monthAgo;
    }).length;

    return { totalEntries, thisWeek, thisMonth };
  };

  const stats = getStatistics();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Entries</h1>
          <p className="text-muted-foreground mt-2">
            View, search, and manage all your daily log entries
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalEntries}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">{stats.thisWeek}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search entries by content or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterPeriod} onValueChange={(value: 'all' | 'week' | 'month') => setFilterPeriod(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-full sm:w-auto"
          >
            {sortOrder === 'desc' ? (
              <>
                <SortDesc className="w-4 h-4 mr-2" />
                Newest First
              </>
            ) : (
              <>
                <SortAsc className="w-4 h-4 mr-2" />
                Oldest First
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Entries List */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Your Entries ({filteredLogs.length})
          </h2>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            {logs.length === 0 ? (
              <>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No entries yet</p>
                <p className="text-sm text-muted-foreground">Start by creating your first daily log!</p>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No entries match your search</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {format(new Date(log.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Updated {format(new Date(log.updatedAt), 'MMM d, yyyy at h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Entry for {format(new Date(log.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {log.content}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {log.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManageEntries;