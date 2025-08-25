import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LC_OPENNING_DATES,
  LC_SETTLEMENT_DATES,
  LC_VALIDATION_DATES,
} from "@/utils/constants";
import {
  openningFormSchema,
  type OpenningFormSchema,
} from "@/utils/validation";
import PersianDatePicker from "@/components/persian-date-picker/PersianDatePicker";
import FileUploader from "@/components/file-uploader/FileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IFileUploadRef, IOpenningFormProps } from "@/utils/type";
import FileDownloadLink from "@/components/ui/FileDownloadLink";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import { BASE_URL } from "@/api/base";

const OpenningForm = ({
  onSubmit,
  faktorData,
  faktorNumber,
  isSubmitting,
}: IOpenningFormProps) => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const sendRef = useRef<IFileUploadRef>(null);
  const subFolder = "eblaghiyeh";
  const faktor = faktorData;

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OpenningFormSchema>({
    resolver: zodResolver(openningFormSchema),
    defaultValues: {
      LCNumber: faktor?.LCNumber || "",
      LCTotal: faktor?.LCTotal || "",
      LCValidation: faktor?.LCValidation || "",
      tarikhgoshayesh: faktor?.tarikhgoshayesh || "",
      tarikheblagh: faktor?.tarikheblagh || "",
      mabnavalue: faktor?.mabnavalue || "",
      tarikhmabnavalue: faktor?.tarikhmabnavalue || "",
      tolerance_manfi: faktor?.tolerance_manfi || "",
      tolerance_mosbat: faktor?.tolerance_mosbat || "",
    },
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

  // بررسی اینکه آیا فایل آپلود شده است یا خیر
  const isSubmitDisabled = !uploadedFileUrl || isSubmitting;

  return (
    <div>
      <div className="w-full max-w-[500px] flex justify-between items-center gap-5 my-5">
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
      <p className="text-red-600 text-center text-[16px] font-normal">
        * آپلود ابلاغیه مهر و امضادار اجباری می‌باشد.
      </p>

      <form
        className="flex flex-col justify-center items-center gap-5 py-5"
        onSubmit={handleSubmit((data) => {
          if (uploadedFileUrl) {
            onSubmit(data);
          }
        })}
      >
        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تاریخ گشایش:</label>
          {faktor?.tarikhgoshayesh &&
          !isNaN(new Date(faktor.tarikhgoshayesh).getTime()) ? (
            <input
              type="text"
              readOnly
              value={faktor.tarikhgoshayesh}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <>
              <PersianDatePicker
                value={watch("tarikhgoshayesh") || null}
                onChange={(date) => setValue("tarikhgoshayesh", date)}
              />
              {errors.tarikhgoshayesh && (
                <p className="text-red-500 text-sm">
                  {errors.tarikhgoshayesh.message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">
            شماره اعتبار اسنادی:
          </label>
          {faktor?.LCNumber ? (
            <input
              type="text"
              readOnly
              value={faktor.LCNumber}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <>
              <input
                className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
                {...register("LCNumber")}
              />
              {errors.LCNumber && (
                <p className="text-red-500 text-sm">
                  {errors.LCNumber.message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">مبلغ اعتبار (ریال):</label>
          {faktor?.LCTotal ? (
            <input
              type="text"
              readOnly
              value={faktor.LCTotal}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <>
              <input
                className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
                {...register("LCTotal")}
              />
              {errors.LCTotal && (
                <p className="text-red-500 text-sm">{errors.LCTotal.message}</p>
              )}
            </>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تاریخ ابلاغ:</label>
          {faktor?.tarikheblagh &&
          !isNaN(new Date(faktor.tarikheblagh).getTime()) ? (
            <input
              type="text"
              readOnly
              value={faktor.tarikheblagh}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <>
              <PersianDatePicker
                value={watch("tarikheblagh") || null}
                onChange={(date) => setValue("tarikheblagh", date)}
              />
              {errors.tarikheblagh && (
                <p className="text-red-500 text-sm">
                  {errors.tarikheblagh.message}
                </p>
              )}
            </>
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
            <>
              <select
                className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2"
                {...register("mabnavalue")}
              >
                <option value="">انتخاب کنید</option>
                {LC_OPENNING_DATES.map(({ label, value }) => (
                  <option
                    key={value}
                    value={value}
                    className="text-[18px] font-normal text-gray-800"
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.mabnavalue && (
                <p className="text-red-500 text-sm">
                  {errors.mabnavalue.message}
                </p>
              )}
            </>
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
            <>
              <select
                className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2"
                {...register("tarikhmabnavalue")}
              >
                <option value="">انتخاب کنید</option>
                {LC_SETTLEMENT_DATES.map(({ label, value }) => (
                  <option
                    key={value}
                    value={value}
                    className="text-[18px] font-normal text-gray-800"
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.tarikhmabnavalue && (
                <p className="text-red-500 text-sm">
                  {errors.tarikhmabnavalue.message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">مدت اعتبار LC:</label>
          {faktor?.LCValidation ? (
            <input
              type="text"
              readOnly
              value={faktor.LCValidation}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <>
              <select
                className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2"
                {...register("LCValidation")}
              >
                <option value="">انتخاب کنید</option>
                {LC_VALIDATION_DATES.map(({ label, value }) => (
                  <option
                    key={value}
                    value={value}
                    className="text-[18px] font-normal text-gray-800"
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.LCValidation && (
                <p className="text-red-500 text-sm">
                  {errors.LCValidation.message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تلرانس منفی:</label>
          {faktor?.tolerance_manfi ? (
            <input
              type="text"
              readOnly
              value={faktor.tolerance_manfi}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <>
              <input
                className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
                {...register("tolerance_manfi")}
              />
              {errors.tolerance_manfi && (
                <p className="text-red-500 text-sm">
                  {errors.tolerance_manfi.message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تلرانس مثبت:</label>
          {faktor?.tolerance_mosbat ? (
            <input
              type="text"
              readOnly
              value={faktor.tolerance_mosbat}
              className="min-w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 bg-gray-100"
            />
          ) : (
            <>
              <input
                className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
                {...register("tolerance_mosbat")}
              />
              {errors.tolerance_mosbat && (
                <p className="text-red-500 text-sm">
                  {errors.tolerance_mosbat.message}
                </p>
              )}
            </>
          )}
        </div>

        <button
          type="submit"
          className={`border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold text-white transition-all duration-300 cursor-pointer ${
            isSubmitDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-900"
          }`}
          disabled={isSubmitDisabled}
          onClick={() =>
            console.log("Submit button clicked, isSubmitting:", isSubmitting, "uploadedFileUrl:", uploadedFileUrl)
          }
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت اطلاعات"}
        </button>
      </form>
    </div>
  );
};

export default OpenningForm;