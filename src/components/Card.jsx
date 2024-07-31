
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiSearch } from "react-icons/fi";
import { FaRupeeSign } from 'react-icons/fa';
import { Link } from "react-router-dom";
const placeholderLogo = 'https://cdn-icons-png.flaticon.com/128/4168/4168507.png'; // Placeholder image URL
const formatIndianCurrency = (price) => {
  let parts = price.toString().split('.');
  let lastThree = parts[0].slice(-3);
  let otherNumbers = parts[0].slice(0, -3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  let formattedPrice = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  if (parts[1]) {
      formattedPrice += '.' + parts[1];
  }
  return formattedPrice;
};

const Card = ({ data }) => {
  // console.log(data);
  
  const { id, companyLogo, jobTitle, companyName, jobLocation, employmentType, minPrice, maxPrice, postingDate, description ,experienceLevel,Workmode,salaryType} = data;
  return (
    <div>
      <section className="card bg-white">
        <Link to={`/singlejob/${id}`} className="flex gap-4 flex-col sm:flex-row items-start">
          <img src={companyLogo || placeholderLogo} alt={jobTitle} className="w-16 h-16 mb-4 rounded" />
          <div className="card-details">
            <h4 className="text-primary mb-1 font-semibold">Company Name : {companyName}</h4>
            <h3 className="text-lg font-semibold mb-2">Job Role : {jobTitle}</h3>

            <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
              <span className="flex items-center gap-2"><FiMapPin /> {jobLocation}</span>
              <span className="flex items-center gap-2"><FiClock /> {employmentType}</span>
              <span className="flex items-center gap-2"><FaRupeeSign className="text-gray-500" /> {formatIndianCurrency(minPrice)} - {formatIndianCurrency(maxPrice)} {salaryType}</span>
              <span className="flex items-center gap-2"><FiCalendar /> {postingDate}</span>
            </div>
            <div><span className="font-semibold text-gray-700">Experience Level:</span> {experienceLevel}</div>
            <div><span className="font-semibold text-gray-700">Work Mode:</span> {Workmode}</div>
            <p className="text-base text-primary/70 ">{description.slice(0, 55)}...<span className="text-emerald-700">Read More</span></p>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Card;
