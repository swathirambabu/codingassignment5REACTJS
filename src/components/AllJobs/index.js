import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import 'index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}
const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const failureViewImg=`https://assets.ccbp.in/frontend/react-js/failure-img.png`

class AllJobs extends Component{
    state={
        profileData:[],

        jobsData:[],
        checkboxInputs:[],
        radioInput:'',
        searchInput:'',
        apiStatus:apiStatusConstants.initial,
        apiJobsStatus:apiJobsStatusConstants.initial,
    }

    componentDidMount=()=>{
        this.onGetJobDetails()
        this.onGetProfileDetails()
    }

   onGetProfileDetails=async()=>{
        this.setState({apiStatus:apiStatusConstants.inProgress})
        const jwtToken=Cookies.get('jwt_token')
        const {checkboxInputs,radioInput,searchInput}=this.state

        const apiUrl=`https://apis.ccbp.in/profile`
        
        const options={
            headers:{
                Authorization:`Bearer ${jwtToken}`,
            },
            method:'GET',
        }

        const response=await fetch(apiUrl,options)
        if(response.ok===true){
            const data=[await response.json()]
            const updatedDataProfile=data.map(each=>({
                name:each.profile_details.name,
                profileImageUrl:each.profile_details.profile_image_url,
                shortBio:each.profile_details.short_bio,



            }))
            this.setState({profileData:updatedDataProfile,
                responseSuccess:true,
            apiStatus:apiStatusConstants.success})

        }else{
            this.setState({apiStatus:apiStatusConstants.failure})
        }
    }



    onGetJobDetails=async()=>{
        this.setState({apiStatus:apiStatusConstants.inProgress})
        const jwtToken=Cookies.get('jwt_token')
        const {checkboxInputs,radioInput,searchInput}=this.state

        const jobApiUrl=`https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
        
        const options={
            headers:{
                Authorization:`Bearer ${jwtToken}`,
            },
            method:'GET',
        }

        const responseJobs=await fetch(jobApiUrl,options)
        if(responseJobs.ok===true){
            const data=await responseJobs.json()
            const updatedDataJobs=data.jobs.map(each=>({
                companyLogoUrl: each.company_logo_url,  
                employmentType: each.employment_type,
                id: each.id,
                jobDescription: each.job_description,
                
                location: each.location,
                rating: each.rating,
                title: each.title,
                packagePerAnnum: each.package_per_annum,
            }))
            this.setState({jobsData:updatedDataJobs,
              
            apiJobsStatus:apiStatusConstants.success})

        }else{
            this.setState({apiJobsStatus:apiStatusConstants.failure})
        }
    }


    onGetRadioOption=event=>{
        this.setState({radioInput:event.target.id},this.onGetJobDetails)
    }

    onGetInputOption=event=>{
        const {checkboxInputs}=this.state
        const inputNotInList=checkboxInputs.filter(each=>each===event.target.id)

        if(inputNotInList.length===0){
            this.setState(prevState=>({checkboxInputs:[...prevState.checkboxInputs,event.target.id],}),this.onGetJobDetails)
        }else{
            const filteredData=checkboxInputs.filter(each=>each!==event.target.id)

            this.setState(prevState=>({checkboxInputs:filteredData}),this.onGetJobDetails)
        }
    }



    onGetProfileView=()=>{
        const {profileData,responseSuccess}=this.state
        if(responseSuccess){
            const {name,profileImageUrl,shortBio}=profileData[0]
            return(
                <div className="profile-container">
                    <img src={profileImageUrl} alt="profile" className="profile-icon"/>
                    <h1 className="profile-name">{name}</h1>
                    <p className="profile-description">{shortBio}</p>
                </div>
            )
        }
        return null
    }

    onRetryProfile=()=>{
        this.onGetProfileDetails()
    }


    onGetProfileFailureView=()=>(
        <div className="failure-button-container">
            <button className="failure-button" type="button"
             onClick={this.onRetryProfile}>retry</button>
        </div>
    )
    
        renderLoadingView=()=>(
    <div className="loader-container" data-testid="loader">
  <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
</div>
        )


    onRenderProfileStatus=()=>{
      const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onRetryJobs=()=>{
        this.onGetJobDetails()
    }
    
    onGetJobsFailureView=()=>(
        <div className="failure-img-button-container">
        <img
          src={failureViewImg}
          alt="failure view"
          className="failure-img"
        />
        <h1 className="failure-heading">
          Oops! Something Went Wrong
        </h1>
        <p className="failure-paragraph">
          We cannot seem to find the page you are looking for
        </p>
        <div className="jobs-failure-button-container">
        <button
          type="button"
         
          className="failure-button"
          onClick={this.onRetryJobs}
        >
          retry
        </button>
      </div>
      </div>
    )

    onGetJobsView=()=>{
        const {jobsData}=this.state
        const noJobs=jobsData.length===0
        return noJobs?(
            <div className="no-jobs-container">
                    <img className="no-jobs-img"
                    src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png " 
                    alt="no jobs" />
                    <h1 >No Jobs Found</h1>
                    <p>We could not find any jobs. Try other filters.</p>
                </div>
        ):(
            <ul className="ul-job-items-container">
                {jobsData.map(each=>(
                     <JobItem jobData={each} key={each.id}/>
                    ))}
            </ul>
        )
    }   
      
      
  onRenderJobsStatus=()=>{
      const {apiStatus} = this.state

    switch (apiJobStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetJobsView()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetCheckBoxesView=()=>(
      <ul className="check-boxes-container">
          {employmentTypesList.map(each=>(
              <li className="li-container" key={each.employmentTypeId}>
                  <input className="input" id={each.employmentTypeId}
                  type="checkbox" onChange={this.onGetInputOption}/>
                  <label className="label" htmlFor={each.employmentTypeId}>
                      {each.label}
                  </label>
              </li>
          ))}
      </ul>
)

onGetRadioButtonView=()=>(
    <ul className="radio-button-container">
          {salaryRangesList.map(each=>(
              <li className="li-container" key={each.salaryRangeId}>
                  <input className="radio" id={each.salaryRangeId}
                  type="radio" name="option" onChange={this.onGetRadioOption}/>
                  <label className="label" htmlFor={each.salaryRangeId}>
                      {each.label}
                  </label>
              </li>
          ))}
      </ul>
    )


    
  onGetSearchInput=event=>{
      this.setState({searchInput:event.target.value})
  }

  onSubmitSearchInput=()=>{
      this.onGetJobDetails()
  }

  onEnterSearchInput=event=>{
      if(event.key==='Enter'){
          this.onGetJobDetails()
      }
  }

  render(){
      const {checkboxInputs,radioInput,searchInput}=this.state
      return (
          <>
          <Header/>
          <div className="all-jobs-container">
              <div className="side-bar-container">
                  {this.onRenderProfileStatus()}
                  <hr className="hr-line"/>
                  <h1 className="text" >Type of Employment</h1>
                  {this.onGetCheckBoxesView()}
                  <hr className="hr-line"/>
                  <h1 className="text" >Salary Range</h1>
                  {this.onGetRadioButtonView()}
              </div>
              <div className="jobs-container">
                <div>                  
                      <input className="search-input" type="search" value={searchInput}
                      placeholder="Search" onChange={this.onGetSearchInput} onKeyDown={this.onEnterSearchInput}/>
                      <button data-testid="searchButton" type="button" 
                      className="search-button"
                       onClick={this.onSubmitSearchInput}>
                     
                      <AiOutlineSearch className="search-icon"/>
                      </button>
                    </div>
                       {this.onRenderJobsStatus()}
                  </div>
              </div>           
        </>         
      )
  }
export default AllJobs