export const Button = (params: { title: string }) => {
  return (
    <div className="m-2 cursor-pointer rounded-2xl bg-influencer px-8 py-4 text-center text-white ">
      {params.title}
    </div>
  );
};
