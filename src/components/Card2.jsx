
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const Card = ({ data, handleApprove,handleDecline }) => {
  // console.log(data);
  const {id,companyLogo, jobTitle, companyName, jobLocation, employmentType, minPrice,maxPrice, postingDate, description,status} = data;

  return (
    <div>
      <section className="card bg-slate-300">
        <Link to={`/singlejob/${id}`} className="flex gap-4 flex-col sm:flex-row items-start">
          <img src={companyLogo} alt={jobTitle} className="w-16 h-16 mb-4" />
          <div className="card-details">
            <h4 className="text-primary mb-1">{companyName}</h4>
            <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>

            <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
              <span className="flex items-center gap-2"><FiMapPin/> {jobLocation}</span>
              <span className="flex items-center gap-2"><FiClock/> {employmentType}</span>
              <span className="flex items-center gap-2"><FiDollarSign/> {minPrice}-{maxPrice}k</span>
              <span className="flex items-center gap-2"><FiCalendar/> {postingDate}</span>
            </div>
            <div className=" flex justify-center bg-sky-950 rounded-lg m-2"><h1 className="text-gray-400">Status: {status}</h1></div>
            <p className="text-base text-primary/70 ">{description.slice(0,33)+"...Read More"}</p>
           
          </div>
        </Link>
         <div className="flex justify-around">
              <button className="bg-sky-600 hover:bg-sky-900 px-3 py-1 rounded text-white" onClick={()=>{handleApprove(id);}}>Approve</button>
              <button className="bg-red-600 hover:bg-red-900 px-3 py-1 rounded text-white" onClick={()=>{handleDecline(id)}}>Decline</button>
            </div>
      </section>
    </div>
  );
};

export default Card;
