import { UserProfile } from '@/hooks/useFinanceData';

interface UserProfileCardProps {
  profile: UserProfile;
  userName: string;
  completedChallenges: number;
  unlockedAchievements: number;
}

const UserProfileCard = ({ profile, userName, completedChallenges, unlockedAchievements }: UserProfileCardProps) => {
  const xpPercentage = ((profile.xp) / (profile.xp + profile.xpToNextLevel)) * 100;

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'from-purple-500 to-pink-500';
    if (level >= 5) return 'from-blue-500 to-purple-500';
    if (level >= 3) return 'from-green-500 to-blue-500';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getLevelColor(profile.level)} flex items-center justify-center text-white text-xl font-bold`}>
            {profile.avatar}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-600">{profile.title}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-progress">Lv.{profile.level}</div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>🔥</span>
            <span>{profile.streak} giorni</span>
          </div>
        </div>
      </div>

      {/* Barra XP */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Esperienza</span>
          <span className="text-progress font-medium">{profile.xp} / {profile.xp + profile.xpToNextLevel} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-progress to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-savings">{profile.totalXp}</div>
          <div className="text-xs text-gray-500">XP Totali</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-expense">{completedChallenges}</div>
          <div className="text-xs text-gray-500">Challenge</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-progress">{unlockedAchievements}</div>
          <div className="text-xs text-gray-500">Achievement</div>
        </div>
      </div>

      {/* Record streak */}
      {profile.longestStreak > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>🏆</span>
            <span>Record streak: {profile.longestStreak} giorni</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard; 