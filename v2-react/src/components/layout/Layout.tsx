import React from 'react';
import { Compass, Map as MapIcon, Calendar, Home, Car } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen text-slate-100 selection:bg-brand-earth-ochre/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-green-deep/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Compass className="w-8 h-8 text-brand-earth-ochre animate-pulse" />
                            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Chapadeiros Voadores
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            {[
                                { icon: MapIcon, label: 'Roteiro' },
                                { icon: Compass, label: 'Atrações' },
                                { icon: Home, label: 'Hospedagem' },
                                { icon: Car, label: 'Transporte' },
                                { icon: Calendar, label: 'Custos' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 group"
                                >
                                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Viagem Prevista</p>
                                <p className="text-xs font-semibold text-white">30 Mai — 07 Jun</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-16 pb-20">
                {children}
            </main>

            {/* Footer / Mobile Nav */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-green-deep/95 backdrop-blur-lg border-t border-white/10 px-6 py-3">
                <div className="flex justify-between items-center text-slate-400">
                    <MapIcon className="w-6 h-6 hover:text-white" />
                    <Compass className="w-6 h-6 text-brand-earth-ochre" />
                    <Home className="w-6 h-6 hover:text-white" />
                    <Calendar className="w-6 h-6 hover:text-white" />
                </div>
            </footer>
        </div>
    );
};
