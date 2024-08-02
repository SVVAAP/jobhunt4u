
const Jobs = ({ result , totalJobs}) => {
  return (
    <>
     <div>
     <h3 className='text-lg font-bold mb-2 text-white '>{totalJobs} Jobs</h3>
     </div>
      <section className="card-container">{result}</section>
    </>
  );
};

export default Jobs;