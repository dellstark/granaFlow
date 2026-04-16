import React from 'react';
import { Trophy, Star, Gift, Target, Zap, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { ACHIEVEMENTS } from '../constants/achievements';

interface RewardsProps {
  unlockedAchievements?: string[];
}

export function Rewards({ unlockedAchievements = [] }: RewardsProps) {
  return (
    <div className="space-y-8">
      <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-8 rounded-[2.5rem] border border-glass-border dark:border-dark-glass-border shadow-sm">
        <h2 className="text-3xl font-black dark:text-white mb-2">Suas Conquistas</h2>
        <p className="text-sm text-text-muted dark:text-gray-400">
          Você desbloqueou {unlockedAchievements.length} de {ACHIEVEMENTS.length} conquistas!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ACHIEVEMENTS.map((reward, index) => {
          const isUnlocked = unlockedAchievements.includes(reward.id);
          
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border shadow-sm transition-all text-center relative overflow-hidden",
                isUnlocked 
                  ? "border-accent/30 shadow-xl shadow-accent/5" 
                  : "border-glass-border dark:border-dark-glass-border grayscale opacity-60"
              )}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl shadow-lg">
                    <Star size={16} className="text-text-muted" />
                  </div>
                </div>
              )}

              <div className="mb-4 relative">
                <div className={cn(
                  "text-5xl mb-2 transition-transform duration-300",
                  isUnlocked && "group-hover:scale-125"
                )}>
                  {reward.emoji}
                </div>
              </div>
              <h3 className="text-sm font-black dark:text-white mb-1">{reward.label}</h3>
              <p className="text-[10px] text-text-muted dark:text-gray-400 font-bold uppercase leading-tight">
                {reward.description}
              </p>
              
              <div className="mt-4 pt-4 border-t border-glass-border dark:border-dark-glass-border">
                <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full transition-all duration-1000",
                    isUnlocked ? "bg-accent w-full" : "bg-text-muted w-0"
                  )} />
                </div>
                <p className={cn(
                  "text-[9px] font-black uppercase mt-2",
                  isUnlocked ? "text-accent" : "text-text-muted"
                )}>
                  {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
