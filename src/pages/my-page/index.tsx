import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";

const MyPage = () => {
  return (
    <div>
      <h1>마이 페이지</h1>
      <PersonalInfo />  
      <Portfolio />
    </div>
  );
};
export default MyPage;