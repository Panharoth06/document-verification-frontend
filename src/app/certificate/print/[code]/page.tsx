export default async function CertificatePrintPage({
  searchParams,
}: {
  searchParams: Promise<{
    owner: string;
    course: string;
    offeredBy: string;
    topics: string;
    date: string;
  }>;
}) {
  const params = await searchParams;
  const { owner, course, offeredBy, topics, date } = params;

  return (
    <div className="w-[1123px] h-[794px] flex items-center justify-center bg-white font-serif">
      <div className="w-[1003px] h-[674px] border-4 border-gray-800 p-[40px] flex items-center justify-center">
        <div className="w-full h-full border-2 border-gray-600 p-[40px] grid grid-rows-[auto_auto_1fr_auto] text-gray-900">
          <div className="text-center space-y-4">
            <h1 className="text-[48px] font-bold tracking-wide">
              Certificate of Completion
            </h1>
            <p className="text-[18px]">This certifies that</p>
          </div>
          <div className="text-center mt-[20px]">
            <div className="inline-block border-b-2 border-gray-800 pb-[6px]">
              <h2 className="text-[40px] font-bold">{owner}</h2>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-[18px]">has successfully completed</p>
            <h3 className="text-[28px] font-semibold text-center">
              {course}
            </h3>
            <p className="text-[14px] text-center max-w-[700px]">
              Covered Topics: {topics}
            </p>
          </div>

          <div className="grid grid-cols-2 items-end mt-[20px]">
            <div className="text-left space-y-2">
              <p className="text-[14px]">Offered By</p>
              <p className="text-[16px] font-semibold">{offeredBy}</p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-[14px]">Issue Date</p>
              <p className="text-[16px] font-semibold">
                {new Date(date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
