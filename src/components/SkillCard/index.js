const SkillCard = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails
  return (
    <li className="skills-item-container">
      <div className="skills-container">
        <img src={imageUrl} className="skill-image" alt={name} />
        <p className="skill-name">{name}</p>
      </div>
    </li>
  )
}
export default SkillCard
