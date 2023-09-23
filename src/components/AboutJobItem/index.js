import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocation} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'
import { matchPrecache } from 'workbox-precaching'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}


class AboutJobItem extends Component{
    state={jobDataDetails:[],
    similarJobsData:[],
    apiStatus:apiStatusConstants.initial
    }

    componentDidMount(){
        this.getJobData()
    }

    getJobData=async props=>{
        const {match}=this.props
        const {params}=match
        const {id}=params
        this.setState({apiStatus:apiStatusConstants.inProgress})

        const jwtToken=Cookies.get('jwt_token')
        const url=`https://apis.ccbp.in/jobs/${id}`
        const options={
            headers:{Authorization:`Bearer ${jwtToken}`},
            method:GET,
        }
        const responseJobData=await fetch(url,options)
        if(responseJobData.ok===true){
            const fetchedJobData=await responseJobData.json()
            const updatedJobDetailsData=[fetchedData.job_details].map(each=>({
                companyLogoUrl: each.company_logo_url, 
                companyWebsiteUrl:each.company_website_url, 
                employmentType: each.employment_type,
                id: each.id,
                jobDescription: each.job_description,
                
                location: each.location,
                rating: each.rating,
                title: each.title,
                packagePerAnnum: each.package_per_annum,
                lifeAtCompany:{
                    description:each.life_at_company.description,
                    imageUrl:each.life_at_company.image_url,
                }
                skills:each.skills.map(eachSkill=>({
                    imageUrl:eachSkill.image_url,
                    name:eachSkill.name,
                }))
            }))


            const updatedSimilarJobDetails=fetchedJobData.Similar_jobs.map(each=>({
                companyLogoUrl: each.company_logo_url, 
                 
                employmentType: each.employment_type,
                id: each.id,
                jobDescription: each.job_description,
                
                location: each.location,
                rating: each.rating,
                title: each.title,
            }))
            this.setState({
                jobDataDetails:updatedJobDetailsData,
                similarJobsData:updatedSimilarJobDetails,
                apiStatus:apiStatusConstants.success,
            })
        }else{
            this.setState({apiStatus:apiStatusConstants.failure})
        }

    }

    renderJobDetailsSuccessView=()=>{
        const {jobDetails,similarJobsData}=thi.state

        if(jobDataDetails.length>=1)}
        const {companyLogoUrl,companyWebsiteUrl,id,lifeAtCompany,location,packagePerAnnum,rating,skills,title}=jobDataDetails[0]

        return(
            <>
            <div className="job-item-container">
        <div className="first-part-container">
          <div className="img-title-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="title-heading">{title}</h1>
              <div className="star-rating-container">
                <BsStarFill className="star-icon" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-package-container">
            <div className="location-job-type-container">
              <div className="location-icon-location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="employee-type-icon-employee-type-container">
                
                <p className="job-type">{employmentType}</p>
              </div>
            </div>
            <div className="package-container">

            <p className="package-heading">{packagePerAnnum}</p>
            </div>
          </div>
        </div>
        <hr className="line" />
        <div className="second-part-container">
        <div className="description-visit-container">
        <h1 className="description-job-heading">Description</h1>
        <a className="visit-anchor" href={companyWebsiteUrl} >Visit<BiLinkExternal/></a>
       
      </div>
       <p className="description-para">{jobDescription}</p>
       </div>
       <h1>SKills</h1>
       <ul className="ul-job-details-container">
           {skills.map(each=>(
               <li className="li-job-details-container" key={each.name}>
                   <img className="skill-img" src={each.imageUrl} alt={each.name}/>
               </li>
           ))}
       </ul>

       <div className="company-life-img-container">
           <div className="life-heading-para-container">
               <h1 >Life at Company</h1>
               <p>{lifeAtCompany.description}</p>
           </div>
           <img src={lifeAtCompany.imageUrl} alt="life at company"/>
       </div>
       </div>
       <h1 className="similar-jobs-heading">Similar Jobs</h1>
       <ul className="similar-jobs-ul-container">
           {similarJobsData.map(each=>(
               <SimilarJobs
               key={each.id}
               similarJobsData={each}
               employmentType={employmentType}/>
           ))}
       </ul>
       </>
        )
    }
    return null
}

onRetryJobDetailsAgain=()=>{
    this.getJobData()
}

renderJobFailureView=()=>(
    <div className="job-item-failure-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
         
        />
        <h1>
          Oops! Something Went Wrong
        </h1>
        <p>
          We cannot seem to find the page you are looking for
        </p>
        <div className="btn-container-failure">

        <button
          type="button"
        
          className="failure-job-details-button"
          onClick={this.onRetryJobDetailsAgain}
        >
          retry
        </button>
      </div>
      </div>
    )

     renderJobLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails=()=>{
      const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobLoadingView()
      default:
        return null
    }
  }

  render(){
      return(
          <>
          <Header/>
          <div className="job-details-view-container">
              {this.renderJobDetails()}
          </div>
          </>
      )
  }
}
export default AboutJobItem