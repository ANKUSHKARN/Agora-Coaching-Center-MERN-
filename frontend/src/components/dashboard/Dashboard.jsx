import Footer from "../common/Footer";
import Item from "../common/Item";
import Navbar from "../common/Navbar";
import SlideBar from "../common/Slidebar";
import Sliding from "../common/Sliding";
import { Link } from "react-router-dom";

const DashBoard = () => {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Navbar></Navbar>
        <Sliding></Sliding>
        <div className="flex flex-row align-middle justify-center flex-wrap gap-4 mt-10">
          <Link to="/dashboard/testlist"><Item imageSrc="https://i.ibb.co/vVQQY6S/exam.png" title="Tests"></Item></Link>
          <Link to="/dashboard/notes"><Item imageSrc="https://i.ibb.co/k4Qk8tM/notes.png" title="Notes"></Item></Link>
          <Link to="/dashboard/bank"><Item imageSrc="https://i.ibb.co/Y0td5k1/bank.png" title="Questionnaire"></Item></Link>
          <Link to="/dashboard/result"><Item imageSrc="https://i.ibb.co/m95fXHy/analysis.png" title="Result"></Item></Link>
          <Link to="/dashboard/feedback"><Item imageSrc="https://i.ibb.co/8gHR1rR/good-feedback.png" title="Feedback"></Item></Link>
        </div>
        <Footer></Footer>
      </div>
      <SlideBar />
    </div>
  );
};

export default DashBoard;
