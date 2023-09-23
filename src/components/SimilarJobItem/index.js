import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobItem = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <li className="similar-job-item">
      <div className="logo-title-location-container">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="title-heading">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="rating-icon" />
              <p className="rating-heading">{rating}</p>
            </div>
          </div>
        </div>

        <div className="location-package-container">
          <div className="location-employee-container">
            <div className="location-container">
              <MdLocationOn className="location-icon" />
              <p className="location-heading">{location}</p>
            </div>
            <div className="employee-type-container">
              <BsFillBriefcaseFill className="brief-case-icon" />
              <p className="employee-type-heading">{employmentType}</p>
            </div>
          </div>

          <p className="package-heading">{packagePerAnnum}</p>
        </div>
      </div>
      <hr className="line" />
      <h1 className="description-heading">Description</h1>
      <p className="description-text">{jobDescription}</p>
    </li>
  )
}
export default SimilarJobItem