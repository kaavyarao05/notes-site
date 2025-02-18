import Card from '@/app/1components/Card';

export default function Home() {
  return (
    <div>
      <div>
        <Card
        title={"Test Title"}
        preview={"Preview"}
        className={"bg-[#ffcdd6]"}/>

        <Card
        title={"Test Title"}
        preview={"Preview"}
        className={"bg-[#9fffdf]"}/>

        <Card
        title={"Test Title"}
        preview={"Preview"}
        className={"bg-[#a7e9ff]"}/>
      </div>
    </div>
  );
}
