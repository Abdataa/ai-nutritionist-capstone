import { ChefHat, TrendingUp, ShoppingCart, FileText, ArrowRight, Sparkles, LogIn, UserPlus  } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ThemeToggle } from '../components/ThemeToggle';

export function LandingPage({ onNavigate }) {
  const features = [
    {
      icon: ChefHat,
      title: 'AI-Powered Meal Plans',
      description: 'Generate personalized 7-day meal plans tailored to your client\'s goals in seconds.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: TrendingUp,
      title: 'Macro Breakdown',
      description: 'Detailed nutritional analysis with protein, carbs, and fats tracking for every meal.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: ShoppingCart,
      title: 'Grocery Lists',
      description: 'Automatic weekly shopping lists organized by category to save your clients time.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: FileText,
      title: 'Export & Share',
      description: 'Download PDFs or share direct links with clients for easy access anywhere.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/20 animate-fade-in">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 transition-transform hover:scale-105">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Nutritionist</span>
          </div>
<nav className="flex items-center gap-3">
  <ThemeToggle />

  {/* Login */}
  <Button
    variant="ghost"
    onClick={() => onNavigate('login')}
    className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
  >
    {/* Desktop text */}
    <span className="hidden sm:inline">Log In</span>

    {/* Mobile icon */}
    <LogIn className="w-5 h-5 sm:hidden" />
  </Button>

  {/* Signup */}
  <Button
    onClick={() => onNavigate('signup')}
    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
  >
    {/* Desktop text */}
    <span className="hidden sm:inline">Get Started</span>

    {/* Mobile icon */}
    <UserPlus className="w-5 h-5 sm:hidden" />
  </Button>
</nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mb-6 animate-slide-up shadow-sm hover:shadow-md transition-shadow">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Powered by Advanced AI</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Create Personalized Meal Plans in <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Seconds</span> with AI
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Help your clients reach their fitness goals faster with AI-generated meal plans, macro tracking, and grocery lists—all in one professional platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/60 transition-all hover:scale-105"
            onClick={() => onNavigate('signup')}
          >
            Generate Meal Plan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-600 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
            onClick={() => onNavigate('demo')}
          >
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-slate-200 dark:border-slate-700 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="transition-transform hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">10k+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Plans Generated</div>
          </div>
          <div className="transition-transform hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">5k+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Active Coaches</div>
          </div>
          <div className="transition-transform hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">98%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Client Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">succeed</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Professional tools designed for fitness coaches who want to deliver exceptional value to their clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} dark:bg-opacity-20 flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:shadow-lg`}>
                    <Icon className={`w-6 h-6 ${feature.color} dark:opacity-90`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Card className="border-none bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-2xl overflow-hidden relative group hover:shadow-emerald-500/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <CardContent className="p-8 sm:p-12 text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your coaching?
            </h2>
            <p className="text-lg sm:text-xl text-emerald-50 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of coaches who are saving time and delivering better results with AI Nutritionist.
            </p>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
              onClick={() => onNavigate('signup')}
            >
              Start Creating Plans
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-slate-600 dark:text-slate-400">
          <p className="text-sm">© 2025 AI Nutritionist. Built for professional fitness coaches.</p>
        </div>
      </footer>
    </div>
  );
}