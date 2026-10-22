import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({
  title,
  imageURL,
  description,
  ingredients = [],
  steps = [],
  prepTime,
  cookTime,
  servings,
  tags = [],
  author,
}) {
  const recipeInfo = [
    prepTime > 0 && 'Prep {prepTime} min',
    cookTime > 0 && 'Cook {cookTime} min',
    servings > 0 && 'Servings {servings}',
  ].filter(Boolean)
  return (
    <article className='recipe-card'>
      <h3>{title}</h3>
      {imageURL && (
        <img
          className='recipe-image'
          src={imageURL}
          alt={title}
          loading='lazy'
        />
      )}

      <div className='description'>{description && <p>{description}</p>}</div>

      {author && (
        <em>
          <br />
          Written by <User id={author} />
        </em>
      )}

      {recipeInfo.length > 0 && (
        <p className='recipeInfo'>{recipeInfo.join('•')}</p>
      )}
      <h4>Ingredients</h4>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={`${ingredient}-${index}`}>{ingredient}</li>
        ))}
      </ul>
      <h4>Steps</h4>
      <ol>
        {steps.map((step, index) => (
          <li key={`${step}-${index}`}>{step}</li>
        ))}
      </ol>

      <p className='recipeTags'>
        {tags.map((tag) => (
          <span className='chip' key={tag}>
            {tag}
          </span>
        ))}
      </p>
    </article>
  )
}
Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  imageURL: PropTypes.string,
  description: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  prepTime: PropTypes.number,
  cookTime: PropTypes.number,
  servings: PropTypes.number,
  tags: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.string,
}
