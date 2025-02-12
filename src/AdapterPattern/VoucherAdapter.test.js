import VoucherAdapter from "./VoucherAdapter"; 
import voucherService from '../services/voucherService';

jest.mock("../services/voucherService", () => ({
  saveUserVoucher: jest.fn(),
}));

describe("🎟 VoucherAdapter Tests", () => {
  let voucherAdapter;

  beforeEach(() => {
    voucherAdapter = new VoucherAdapter();
    jest.clearAllMocks(); // Reset mock giữa các test
  });

  test("Should call saveUserVoucher() with correct data", () => {
    const userId = "123";
    const expectedData = { userId: "123", voucherId: "6" };

    voucherAdapter.update(userId);

    expect(voucherService.saveUserVoucher).toHaveBeenCalledWith(expectedData);
    expect(voucherService.saveUserVoucher).toHaveBeenCalledTimes(1);
  });

  test("Should not call saveUserVoucher if userId is undefined", () => {
    voucherAdapter.update(undefined);
    expect(voucherService.saveUserVoucher).toHaveBeenCalledWith({ userId: undefined, voucherId: "6" });
  });
});
