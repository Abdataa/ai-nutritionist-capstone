import { useState } from 'react';
import { Search, Plus, Mail, Phone, Calendar, Target, TrendingUp, Filter, MoreVertical, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function Clients({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

  // Fabricated client data
  const clientsData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      goal: 'Muscle Gain',
      status: 'Active',
      joinDate: 'Jan 15, 2025',
      currentWeight: '145 lbs',
      targetWeight: '155 lbs',
      progress: 65,
      activePlans: 2,
      totalCalories: 2800,
      avatar: 'SJ',
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      goal: 'Fat Loss',
      status: 'Active',
      joinDate: 'Dec 20, 2024',
      currentWeight: '210 lbs',
      targetWeight: '185 lbs',
      progress: 45,
      activePlans: 1,
      totalCalories: 1800,
      avatar: 'MC',
      avatarColor: 'bg-teal-500',
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 345-6789',
      goal: 'Maintenance',
      status: 'Active',
      joinDate: 'Nov 10, 2024',
      currentWeight: '135 lbs',
      targetWeight: '135 lbs',
      progress: 95,
      activePlans: 1,
      totalCalories: 2200,
      avatar: 'ED',
      avatarColor: 'bg-orange-500',
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'j.wilson@email.com',
      phone: '+1 (555) 456-7890',
      goal: 'Muscle Gain',
      status: 'Active',
      joinDate: 'Jan 5, 2025',
      currentWeight: '175 lbs',
      targetWeight: '190 lbs',
      progress: 30,
      activePlans: 3,
      totalCalories: 3000,
      avatar: 'JW',
      avatarColor: 'bg-blue-500',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '+1 (555) 567-8901',
      goal: 'Fat Loss',
      status: 'Inactive',
      joinDate: 'Oct 8, 2024',
      currentWeight: '165 lbs',
      targetWeight: '145 lbs',
      progress: 20,
      activePlans: 0,
      totalCalories: 1900,
      avatar: 'LA',
      avatarColor: 'bg-purple-500',
    },
    {
      id: 6,
      name: 'David Martinez',
      email: 'david.m@email.com',
      phone: '+1 (555) 678-9012',
      goal: 'Athletic Performance',
      status: 'Active',
      joinDate: 'Dec 1, 2024',
      currentWeight: '185 lbs',
      targetWeight: '180 lbs',
      progress: 80,
      activePlans: 2,
      totalCalories: 2600,
      avatar: 'DM',
      avatarColor: 'bg-rose-500',
    },
    {
      id: 7,
      name: 'Rachel Kim',
      email: 'rachel.k@email.com',
      phone: '+1 (555) 789-0123',
      goal: 'Muscle Gain',
      status: 'Active',
      joinDate: 'Jan 12, 2025',
      currentWeight: '128 lbs',
      targetWeight: '140 lbs',
      progress: 50,
      activePlans: 1,
      totalCalories: 2500,
      avatar: 'RK',
      avatarColor: 'bg-indigo-500',
    },
    {
      id: 8,
      name: 'Tom Baker',
      email: 'tom.baker@email.com',
      phone: '+1 (555) 890-1234',
      goal: 'Fat Loss',
      status: 'Active',
      joinDate: 'Nov 25, 2024',
      currentWeight: '225 lbs',
      targetWeight: '200 lbs',
      progress: 40,
      activePlans: 2,
      totalCalories: 2000,
      avatar: 'TB',
      avatarColor: 'bg-cyan-500',
    },
  ];

  // Filter clients based on search and status
  const filteredClients = clientsData.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: 'Total Clients',
      value: clientsData.length,
      icon: User,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Active Clients',
      value: clientsData.filter(c => c.status === 'Active').length,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    },
    {
      label: 'Total Plans',
      value: clientsData.reduce((sum, c) => sum + c.activePlans, 0),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Clients</h1>
        <p className="text-slate-600 dark:text-slate-300">Manage and track all your coaching clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index}
              className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="flex-1 sm:flex-none"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                className="flex-1 sm:flex-none"
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                className="flex-1 sm:flex-none"
              >
                Inactive
              </Button>
            </div>
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredClients.map((client, index) => (
          <Card 
            key={client.id}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onNavigate('demo')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${client.avatarColor} flex items-center justify-center text-white font-bold text-lg`}>
                    {client.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-1">{client.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={client.status === 'Active' ? 'default' : 'secondary'}
                        className={client.status === 'Active' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }
                      >
                        {client.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {client.goal}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Joined {client.joinDate}</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Progress</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{client.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Current</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{client.currentWeight}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Target</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{client.targetWeight}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Plans</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{client.activePlans}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredClients.length === 0 && (
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-12 text-center">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No clients found</h3>
            <p className="text-slate-600 dark:text-slate-300">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
