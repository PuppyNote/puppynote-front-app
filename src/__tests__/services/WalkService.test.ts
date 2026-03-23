import { walkService } from '../../services/walk/WalkService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('WalkService (산책 서비스)', () => {
  const mockPetId = 1;
  const mockDate = '2026-03-23';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getWalkHistory는 특정 날짜의 산책 기록 목록을 성공적으로 가져와야 한다', async () => {
    const mockHistory = [
      { walkId: 1, location: '공원', startTime: '2026-03-23T10:00:00', endTime: '2026-03-23T11:00:00' }
    ];

    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockHistory,
      statusCode: 200,
    });

    const result = await walkService.getWalkHistory(mockPetId, mockDate);

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/walks', {
      params: { petId: mockPetId, date: mockDate }
    });
    expect(result).toEqual(mockHistory);
  });

  it('saveWalk는 새로운 산책 기록을 성공적으로 저장해야 한다', async () => {
    const walkData = {
      petId: mockPetId,
      location: '한강',
      startTime: '2026-03-23T14:00:00',
      endTime: '2026-03-23T15:00:00',
      latitude: 37.5,
      longitude: 127.0,
      photoKeys: []
    };

    (apiService.post as jest.Mock).mockResolvedValue({
      statusCode: 200,
      message: '저장 성공'
    });

    await walkService.saveWalk(walkData);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/walks', walkData);
  });

  it('getWalkCalendar는 월별 산책 여부 데이터를 성공적으로 가져와야 한다', async () => {
    const mockYearMonth = '2026-03';
    const mockCalendarData = [
      { date: '2026-03-01', hasWalk: true },
      { date: '2026-03-02', hasWalk: false }
    ];

    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockCalendarData,
      statusCode: 200,
    });

    const result = await walkService.getWalkCalendar(mockPetId, mockYearMonth);

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/walks/calendar', {
      params: { petId: mockPetId, yearMonth: mockYearMonth }
    });
    expect(result).toEqual(mockCalendarData);
  });

  it('deleteWalk는 특정 산책 기록을 성공적으로 삭제해야 한다', async () => {
    const mockWalkId = 100;

    (apiService.delete as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await walkService.deleteWalk(mockWalkId);

    expect(apiService.delete).toHaveBeenCalledWith(`/api/v1/walks/${mockWalkId}`);
  });
});
