import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null

let sampleRecipes = []

beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  sampleRecipes = [
    {
      title: 'Vermont Cheddar Ale Soup',
      imageURL:
        'https://graftonvillagecheese.com/wp-content/uploads/Recipes/GraftonCheddarAleSoup_GraftonInn-456x456.png',
      author: testUser._id,
      ingredients: [
        '1 garlic bulb, roasted',
        '1 sweet onion, chopped & caramelized',
        '1 red pepper, diced 1/4 inch pieces',
        '1 carrot, peeled and diced 1/4 inch pieces',
        '2 shallots, thinly chopped',
        '2 qt vegetable stock',
        '1 pint heavy cream',
        '2 pounds Grafton Cheddar, shredded',
        '22 oz McNeill’s Firehouse Ale',
        '3 large Yukon gold potatoes, diced 1/2 inch pieces',
        '1/4 pound unsalted butter',
        'Extra virgin olive oil',
      ],
      steps: [
        'Sauté shallots, peppers, and carrots until soft in 2 T olive oil and 1 T butter.',
        'Add bottle of beer and simmer 5 minutes.',
        'Add caramelized onions, potatoes, stock and remaining butter.',
        'Simmer until potatoes are tender, then turn off flame.',
        'Add cream, roasted garlic and cheddar slowly with whisk.',
        'Puree in blender.',
        'Add salt & pepper to taste. Garnish with fresh chives and croutons.',
      ],
      tags: ['soup'],
    },
    {
      title: 'Formaggio Quattro Risotto',
      imageURL:
        'https://blog.giallozafferano.it/cucinaplus/wp-content/uploads/2018/02/1517817861942.jpg',
      author: testUser._id,
      ingredients: [
        '1/4 cup butter',
        '1/2 cup chopped shallots',
        '1 1/2 cups Arborio or carnaroli rice',
        '1 cup white dry wine',
        '3 cups hot chicken broth',
        'Salt and freshly ground black pepper',
        '1/4 cup grated Fontina cheese',
        '1/4 cup grated Parmigiano cheese',
        '1/4 cup grated Swiss cheese',
        '1/4 cup Pecorino cheese',
      ],
      steps: [
        'Heat two tablespoons of butter in a 12-inch skillet.',
        'Add shallots and saute over low heat for 5 minutes.',
        'Add arborio rice and cook 2 minutes, then add wine to skillet.',
        'Add broth, a little at a time, and cook until rice is soft and all broth has been absorbed, about 23 minutes.',
        'Season with salt and pepper.',
        'Stir in the rest of the butter.',
        'Sprinkle cheeses on top of rice and toss.',
        'Serve immediately.',
      ],
      tags: ['rice'],
    },
    {
      title: 'Neapolitan-style Pizza Dough',
      imageURL:
        'https://www.seriouseats.com/thmb/ACyF6kv3V4qAo_H9E-98X5jhuDc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20211115-OONI-PIZZA-ARMENIAN-ANDREW-JANJIGIAN-23-5447ecc61b12450d9a09f38cca67c19c.jpg',
      author: testUser._id,
      ingredients: [
        '1/4 teaspoon active dry yeast',
        '1.5 cups warm water',
        '2 tsp olive oil, 2 tsp salt',
        '4 cups "00" flour OR AP flour in a pinch',
      ],
      steps: [
        'Activate the yeast in a little of the warm water.',
        'mix all dry in ingredients in a large mixing bowl.',
        'add liquid over top plus yeast, and mix until shaggy.',
        'knead by hand or on med-low in a stand mixer for 10 min.',
        'cover and let rest 5 minutes then knead for another 10 minutes until super smooth and warm.',
        'place dough in a oiled bowl, oil the top and sides of dough, cover and refrigerate overnight.',
        'The next day, take it out, fold it over a few times and return to fridge another 4 hours.',
        'Portion into 4 pieces, round off into smooth balls, cover with a damp towel or large bowl (I covered each ball with a bowl) and spritz with water so the dough does not form a crust (it will not rise otherwise).',
        'After 90 minutes, stretch into 10-12" round, top with sauce/cheese/goodies and bake immediately in a 500-550 degree oven on a hot stone.',
      ],
      tags: ['pizza', 'dough'],
    },
  ]
})

let createdSampleRecipes = []
beforeEach(async () => {
  await Recipe.deleteMany({})
  createdSampleRecipes = []
  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})
describe('getting a recipe', () => {
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})
describe('updating recipes', () => {
  test('should update the specified property', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      description: 'some content change',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.description).toEqual('some content change')
  })
  test('should not update other properties', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      description: 'some content change',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Vermont Cheddar Ale Soup')
  })
  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      description: 'some content change',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe(
      testUser._id,
      '000000000000000000000000',
      {
        description: 'some content change',
      },
    )
    expect(recipe).toEqual(null)
  })
})
describe('deleting recipes', () => {
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})

describe('listing recipes', () => {
  test('should return all recipes', async () => {
    const recipes = await listAllRecipes()
    expect(recipes.length).toEqual(createdSampleRecipes.length)
  })
  test('should return recipes sorted by creation date descending by default', async () => {
    const recipes = await listAllRecipes()
    const sortedSampleRecipes = [...createdSampleRecipes].sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(recipes.map((recipe) => recipe.createdAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.createdAt),
    )
  })
  test('should take into account provided sorting options', async () => {
    const recipes = await listAllRecipes({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSampleRecipes = [...createdSampleRecipes].sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(recipes.map((recipe) => recipe.updatedAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.updatedAt),
    )
  })
  test('should be able to filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor(testUser.username)
    expect(recipes.length).toBe(3)
  })
  test('should be able to filter recipes by tag', async () => {
    const recipes = await listRecipesByTag('soup')
    expect(recipes.length).toBe(1)
  })
})

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'Hello Mongoose!',
      description:
        'This recipe is stored in a MongoDB database using Mongoose.',
      ingredients: ['this', 'is', 'a', 'list', 'of', 'ingredients'],
      steps: ['this', 'is', 'a', 'list', 'of', 'steps'],
      prepTime: 20,
      cookTime: 20,
      servings: 2,
      tags: ['mongoose', 'mongodb'],
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })

  // Tests if no title is included in submitting a new recipe, it should fail
  test('without title should fail', async () => {
    expect.assertions(2) // fails if recipe saved w/o title
    const recipe = {
      description: 'Recipe with no title',
      tags: ['empty'],
      ingredients: ['this', 'is', 'a', 'list', 'of', 'ingredients'],
      steps: ['this', 'is', 'a', 'list', 'of', 'steps'],
    }
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  // Tests if no ingredients list is included in submitting a new recipe, it should fail
  test('without ingredients should fail', async () => {
    expect.assertions(2) // fails if recipe saved w/o ingredients
    const recipe = {
      title: 'Some Recipe Title',
      description: 'Recipe with no ingredients',
      steps: ['the', 'recipe', 'steps'],
      tags: ['empty'],
    }
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`ingredients` are required')
    }
  })

  // Tests if no steps list is included in submitting a new recipe, it should fail
  test('without steps should fail', async () => {
    expect.assertions(2) // fails if recipe saved w/o steps
    const recipe = {
      title: 'Some Recipe Title',
      description: 'Recipe with no steps',
      ingredients: ['the', 'recipe', 'ingredients'],
      tags: ['empty'],
    }
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`steps` are required')
    }
  })

  // bare minimum needed to pass
  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a Title',
      ingredients: ['Only a list of ingredients'],
      steps: ['the', 'recipe', 'steps'],
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
