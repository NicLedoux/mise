import { RecipeList } from '../Components/RecipeList.jsx'
import { CreateRecipe } from '../Components/CreateRecipe.jsx'
import { RecipeFilter } from '../Components/RecipeFilter.jsx'
import { RecipeSorting } from '../Components/RecipeSorting.jsx'
import { Header } from '../Components/Header.jsx'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'

export function Recipes() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const recipesQuery = useQuery({
    queryKey: ['recipes', { author, sortBy, sortOrder }],
    queryFn: () => getRecipes({ author, sortBy, sortOrder }),
  })
  const recipes = recipesQuery.data ?? []
  return (
    <div style={{ padding: 8 }}>
      <Header />
      <hr />
      <CreateRecipe />
      <hr />
      Filter by:
      <RecipeFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <RecipeSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <RecipeList recipes={recipes} />
    </div>
  )
}
