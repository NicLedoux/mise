import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [token] = useAuth()
  const [description, setDescription] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [stepsText, setStepsText] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [tagsText, setTagsText] = useState('')

  const queryClient = useQueryClient()

  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe(token, {
        title,
        imageURL,
        description,
        ingredients: ingredientsText.split('\n').filter(Boolean),
        steps: stepsText.split('\n').filter(Boolean),
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        tags: tagsText
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }

  if (!token) return <div>Please log in to create new recipes.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Recipe Title'
        />
      </div>
      <br />
      <div>
        <label htmlFor='imageURL'>Image URL: </label>
        <input
          type='url'
          name='imageURL'
          id='imageURL'
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          placeholder='https://example.com/photo.jpg'
        />
      </div>

      <div>
        <label htmlFor='create-description'>Description: </label>
        <input
          type='text'
          name='create-description'
          id='create-description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Recipe Description'
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-ingredients'>Ingredients: </label>
        <textarea
          type='text'
          name='create-ingredients'
          id='create-ingredients'
          rows={6}
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          placeholder='List of ingredients'
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-steps'>Steps: </label>
        <textarea
          type='text'
          name='create-steps'
          id='create-steps'
          rows={6}
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          placeholder='Recipe Steps'
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-prep'>Prep time: </label>
        <input
          type='number'
          name='create-prep'
          id='create-prep'
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          placeholder='30'
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-cook'>Cook time: </label>
        <input
          type='number'
          name='create-cook'
          id='create-cook'
          value={cookTime}
          onChange={(e) => setCookTime(e.target.value)}
          placeholder='30'
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-servings'>Servings: </label>
        <input
          type='number'
          name='create-servings'
          id='create-servings'
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          placeholder='15'
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-tags'>Tags: </label>
        <input
          type='text'
          name='create-tags'
          id='create-tags'
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder='Recipe Tags'
        />
      </div>
      <br />
      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || !token || createRecipeMutation.isPending}
      />
      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe created successfully!
        </>
      ) : null}
    </form>
  )
}
