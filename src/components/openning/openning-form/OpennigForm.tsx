import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LC_OPENNING_DATES, LC_SETTLEMENT_DATES } from "@/utils/constants";
import { formatNumberWithComma } from "@/utils/formatNumberWithComma";
import { openingFormSchema, type OpeningFormSchema } from "@/utils/validation";
import PersianDatePicker from "@/components/persian-date-picker/PersianDatePicker";
import FileUploader from "@/components/file-uploader/FileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IOpenningFormProps } from "@/utils/type";
import FileDownloadLink from "@/components/ui/FileDownloadLink";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import { BASE_URL } from "@/api/base";
const OpenningForm = ({
  onSubmit,
  faktorData,
  faktorNumber,
}: IOpenningFormProps) => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const sendRef = useRef<any>(null);
  const subFolder = "eblaghiyeh";
  const faktor = faktorData;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OpeningFormSchema>({
    resolver: zodResolver(openingFormSchema),
  });

  const { data: filesFromServer } = useUploadedFiles(
    faktorNumber,
    subFolder,
    subFolder
  );

  const fileFromServer = filesFromServer?.[0];
  const fileUrl = fileFromServer
    ? `${BASE_URL}${fileFromServer.ServerRelativeUrl}`
    : null;

  useEffect(() => {
    if (fileUrl && uploadedFileUrl !== fileUrl) {
      setUploadedFileUrl(fileUrl);
    }
  }, [fileUrl, uploadedFileUrl]);

  return (
    <div>
      <form
        className="flex flex-col justify-center items-center gap-5 py-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تاریخ گشایش:</label>
          <PersianDatePicker
            value=""
            onChange={(date) => setValue("LCOpenningDate", date)}
          />
          {errors.LCOpenningDate && <p>{errors.LCOpenningDate.message}</p>}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">
            شماره اعتبار اسنادی:
          </label>
          <input
            className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
            {...register("LCNumber")}
          />
          {errors.LCNumber && <p>{errors.LCNumber.message}</p>}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">مبلغ اعتبار (ریال):</label>
          <input
            className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
            {...register("LCTotalPrice")}
            onChange={(e) =>
              setValue("LCTotalPrice", formatNumberWithComma(e.target.value))
            }
          />
          {errors.LCTotalPrice && <p>{errors.LCTotalPrice.message}</p>}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تاریخ ابلاغ:</label>
          <PersianDatePicker
            value=""
            onChange={(date) => setValue("LCCommunicationDate", date)}
          />
          {errors.LCCommunicationDate && (
            <p>{errors.LCCommunicationDate.message}</p>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">مبدا زمان تسویه:</label>
          {faktor?.mabnavalue ? (
            <input
              type="text"
              readOnly
              value={faktor.mabnavalue}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <select
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2"
              {...register("LCOriginOpenningDate")}
            >
              <option value="">انتخاب کنید</option>
              {LC_OPENNING_DATES.map(({ label, value }) => (
                <option
                  key={value}
                  value={value}
                  className="min-w-[230px] rounded-lg min-h-[30px] p-1 text-[18px] font-normal text-gray-800"
                >
                  {label}
                </option>
              ))}
            </select>
          )}
          {errors.LCOriginOpenningDate && (
            <p>{errors.LCOriginOpenningDate.message}</p>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">مدت زمان تسویه:</label>
          {faktor?.tarikhmabnavalue ? (
            <input
              type="text"
              readOnly
              value={faktor.tarikhmabnavalue}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <select
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2"
              {...register("LCSettlementDate")}
            >
              <option value="">انتخاب کنید</option>
              {LC_SETTLEMENT_DATES.map(({ label, value }) => (
                <option
                  key={value}
                  value={value}
                  className="min-w-[230px] rounded-lg min-h-[30px] p-1 text-[18px] font-normal text-gray-800"
                >
                  {label}
                </option>
              ))}
            </select>
          )}
          {errors.LCSettlementDate && <p>{errors.LCSettlementDate.message}</p>}
        </div>

        <button
          type="submit"
          className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
        >
          ثبت اطلاعات
        </button>
      </form>

      <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
        <label className="text-[22px] font-medium">آپلود ابلاغیه:</label>

        {uploadedFileUrl ? (
          <FileDownloadLink url={uploadedFileUrl} />
        ) : (
          <FileUploader
            ref={sendRef}
            orderNumber={faktorNumber}
            subFolder={subFolder}
            docType={subFolder}
            onUploadComplete={(url) => setUploadedFileUrl(url)}
          />
        )}
      </div>
      <p className="text-red-600 text-center text-[16px] font-normal mt-4">
        * آپلود ابلاغیه مهر و امضادار اجباری میباشد.
      </p>
    </div>
  );
};

export default OpenningForm;
