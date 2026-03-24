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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getWalkDetail 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    await walkService.getWalkDetail(1);

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(walkService.getWalkDetail(1)).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(walkService.getWalkDetail(1)).rejects.toThrow('산책 상세 정보 조회에 실패했습니다.');
  });

  it('getWalks 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await walkService.getWalks(1);

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(walkService.getWalks(1)).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(walkService.getWalks(1)).rejects.toThrow('산책 목록 조회에 실패했습니다.');
  });

  it('getWalkHistory 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await walkService.getWalkHistory(1, 'd');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(walkService.getWalkHistory(1, 'd')).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(walkService.getWalkHistory(1, 'd')).rejects.toThrow('산책 이력 조회에 실패했습니다.');
  });

  it('getWalkCalendar 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await walkService.getWalkCalendar(1, 'ym');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(walkService.getWalkCalendar(1, 'ym')).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(walkService.getWalkCalendar(1, 'ym')).rejects.toThrow('캘린더 조회에 실패했습니다.');
  });

  it('saveWalk 성공 및 실패', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 201 });
    await walkService.saveWalk({} as any);

    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400, message: '실패' });
    await expect(walkService.saveWalk({} as any)).rejects.toThrow('실패');

    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400 });
    await expect(walkService.saveWalk({} as any)).rejects.toThrow('산책 기록 저장에 실패했습니다.');
  });

  it('deleteWalk 성공 및 실패', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await walkService.deleteWalk(1);

    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(walkService.deleteWalk(1)).rejects.toThrow('에러');

    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(walkService.deleteWalk(1)).rejects.toThrow('산책 기록 삭제에 실패했습니다.');
  });
});
