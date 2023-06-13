export const Button = (params: { title: string }) => {
  return (
    <div className="w-11/12 cursor-pointer rounded-lg bg-influencer px-8 py-4 text-center text-white lg:mx-5 lg:w-auto lg:rounded-2xl">
      {params.title}
    </div>
  );
};
