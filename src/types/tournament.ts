// Tournament interface for type safety
export interface Tournament {
  tournamentId: string;
  tournamentName: string;
  sport: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  description?: string;
  imageKey?: string;
  createdAt: string;
  updatedAt: string;
}

// Tournament status enum for filtering
export enum TournamentStatus {
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming', 
  PAST = 'past'
}

// Helper function to determine tournament status
export const getTournamentStatus = (tournament: Tournament): TournamentStatus => {
  const now = new Date();
  const startDate = new Date(tournament.startDate);
  const endDate = tournament.endDate ? new Date(tournament.endDate) : null;

  if (endDate && now > endDate) {
    return TournamentStatus.PAST;
  } else if (now < startDate) {
    return TournamentStatus.UPCOMING;
  } else {
    return TournamentStatus.ONGOING;
  }
};

// Helper function to format date range
export const formatDateRange = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (end) {
    return `${formatDate(start)} - ${formatDate(end)}`;
  } else {
    return formatDate(start);
  }
};
