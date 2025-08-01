import { useRef } from "react";
import { useForm } from "react-hook-form";
import { LC_OPENNING_DATES, LC_SETTLEMENT_DATES } from "@/utils/constants";
import { formatNumberWithComma } from "@/utils/formatNumberWithComma";
import { openingFormSchema, type OpeningFormSchema } from "@/utils/validation";
import PersianDatePicker from "@/components/persian-date-picker/PersianDatePicker";
import SectionHeader from "@/components/ui/SectionHeader";
import FileUploader from "@/components/file-uploader/FileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IOpenningFormProps } from "@/utils/type";

const OpenningForm = ({
  onSubmit,
  faktorNumber,
}: IOpenningFormProps) => {

  const sendRef = useRef<any>(null);
  const subFolder = "eblaghiyeh";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OpeningFormSchema>({
    resolver: zodResolver(openingFormSchema),
  });

  return (
    <div>
      <SectionHeader title="اطلاعات اعتبار اسنادی (ابلاغ)" />
      <form
        className="flex flex-col justify-center items-center gap-5 py-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-item">
          <label>تاریخ گشایش:</label>
          <PersianDatePicker
            value=""
            onChange={(date) => setValue("LCOpenningDate", date)}
          />
          {errors.LCOpenningDate && <p>{errors.LCOpenningDate.message}</p>}
        </div>

        <div className="form-item">
          <label>شماره اعتبار اسنادی:</label>
          <input {...register("LCNumber")} />
          {errors.LCNumber && <p>{errors.LCNumber.message}</p>}
        </div>

        <div className="form-item">
          <label>مبلغ اعتبار (ریال):</label>
          <input
            {...register("LCTotalPrice")}
            onChange={(e) =>
              setValue("LCTotalPrice", formatNumberWithComma(e.target.value))
            }
          />
          {errors.LCTotalPrice && <p>{errors.LCTotalPrice.message}</p>}
        </div>

        <div className="form-item">
          <label>تاریخ ابلاغ:</label>
          <PersianDatePicker
            value=""
            onChange={(date) => setValue("LCCommunicationDate", date)}
          />
          {errors.LCCommunicationDate && (
            <p>{errors.LCCommunicationDate.message}</p>
          )}
        </div>

        <div className="form-item">
          <label>مبدا زمان تسویه:</label>
          <select {...register("LCOriginOpenningDate")}>
            <option value="">انتخاب کنید</option>
            {LC_OPENNING_DATES.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.LCOriginOpenningDate && (
            <p>{errors.LCOriginOpenningDate.message}</p>
          )}
        </div>

        <div className="form-item">
          <label>مدت زمان تسویه:</label>
          <select {...register("LCSettlementDate")}>
            <option value="">انتخاب کنید</option>
            {LC_SETTLEMENT_DATES.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.LCSettlementDate && <p>{errors.LCSettlementDate.message}</p>}
        </div>

        <div className="form-item">
          <label>آپلود ابلاغیه:</label>
          <FileUploader
            ref={sendRef}
            orderNumber={faktorNumber}
            subFolder={subFolder}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          ثبت اطلاعات
        </button>
      </form>
      <p className="text-red-600 text-center text-[16px] font-normal mt-4">
        * آپلود ابلاغیه مهر و امضادار اجباری میباشد.
      </p>
    </div>
  );
};

export default OpenningForm;
