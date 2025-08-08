import DbConnect from "@/lib/Db/DbConnect";


export default async function Home() {
  await DbConnect();
  return (
    <div>HEllo </div>
  );
}
