import { createIngredient, createQuantity, createRecipe } from './recipe';

export const RECIPES = [
  createRecipe({
    id: 'shakshuka',
    name: 'Shakshuka',
    description:
      'Eggs poached in a rich, spiced tomato and pepper sauce — a classic Ottolenghi brunch dish.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/shakshuka-6_1_1.jpg?v=1708090280',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({ name: '1 large onion, finely chopped' }),
      createIngredient({ name: '2 red peppers, sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'cloves' }),
        name: 'garlic, crushed',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'cumin',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'smoked paprika',
      }),
      createIngredient({ name: '800g tinned chopped tomatoes' }),
      createIngredient({
        quantity: createQuantity({ amount: 6, unit: '' }),
        name: 'large eggs',
      }),
      createIngredient({ name: 'fresh coriander, to serve' }),
    ],
    steps: [
      'Heat the olive oil in a large frying pan over medium heat.',
      'Add the onion and peppers and cook for 10 minutes until soft.',
      'Stir in the garlic, cumin and paprika and cook for 2 minutes.',
      'Pour in the tomatoes, season well and simmer for 15 minutes.',
      'Make six wells in the sauce and crack an egg into each.',
      'Cover and cook for 5–8 minutes until the whites are set.',
      'Scatter with coriander and serve straight from the pan.',
    ],
  }),
  createRecipe({
    id: 'burnt-aubergine-salad',
    name: 'Burnt Aubergine with Tahini and Pomegranate',
    description:
      'Smoky charred aubergine dressed with tahini, lemon and pomegranate seeds.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Mutabal.jpg?v=1716838425',
    ingredients: [
      createIngredient({ name: '2 large aubergines' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'lemon juice',
      }),
      createIngredient({ name: '1 pomegranate, seeds removed' }),
      createIngredient({ name: 'fresh parsley, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Char the aubergines directly over a gas flame or under a hot grill until blackened and collapsed.',
      'Cool slightly, then scoop the flesh into a colander to drain for 30 minutes.',
      'Mix the tahini with lemon juice and enough water to make a pourable sauce.',
      'Roughly chop the aubergine flesh and arrange on a serving plate.',
      'Drizzle with tahini sauce, olive oil and scatter with pomegranate and parsley.',
    ],
  }),
  createRecipe({
    id: 'sweet-potato-filo-pie',
    name: 'Sweet Potato and Feta Filo Pie',
    description:
      'Layers of crisp filo filled with spiced sweet potato, feta and fresh herbs.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Curried_cauliflower_and_cheese_filo_pie.jpg?v=1717600155',
    ingredients: [
      createIngredient({ name: '800g sweet potatoes, peeled and cubed' }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'feta, crumbled',
      }),
      createIngredient({ name: '6 sheets filo pastry' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'butter, melted',
      }),
      createIngredient({ name: '2 spring onions, sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({ name: '2 eggs, beaten' }),
      createIngredient({ name: 'fresh dill, chopped' }),
    ],
    steps: [
      'Roast the sweet potato at 200°C for 25 minutes until tender.',
      'Mash with cumin, spring onions, dill and most of the feta.',
      'Stir in the eggs and season well.',
      'Layer filo sheets in a greased tin, brushing each with butter.',
      'Spread the filling over the filo and top with remaining sheets.',
      'Brush the top with butter and bake for 35 minutes until golden.',
    ],
  }),
  createRecipe({
    id: 'courgette-fritters',
    name: 'Courgette and Herb Fritters',
    description:
      'Crisp golden fritters packed with grated courgette, mint and parsley.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Courgette_chickpea_and_herb_pancakes.jpg?v=1716187803',
    ingredients: [
      createIngredient({ name: '3 medium courgettes, coarsely grated' }),
      createIngredient({ name: '3 eggs' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'plain flour',
      }),
      createIngredient({ name: 'fresh mint, chopped' }),
      createIngredient({ name: 'fresh parsley, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'feta, crumbled',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Salt the grated courgette and leave for 15 minutes, then squeeze out excess moisture.',
      'Mix the courgette with eggs, flour, herbs and feta.',
      'Heat olive oil in a frying pan over medium-high heat.',
      'Drop spoonfuls of the mixture into the pan and flatten slightly.',
      'Fry for 3 minutes per side until golden and crisp.',
      'Serve warm with a dollop of yogurt.',
    ],
  }),
  createRecipe({
    id: 'harissa-chicken',
    name: 'Harissa-Roasted Chicken',
    description:
      'Whole chicken rubbed with fiery harissa paste and roasted until juicy.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/orange_harissa_chicken_2.jpg?v=1782900912',
    ingredients: [
      createIngredient({ name: '1 whole chicken, about 1.5kg' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'harissa paste',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({ name: '1 lemon, halved' }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'cloves' }),
        name: 'garlic, crushed',
      }),
      createIngredient({ name: 'sea salt and black pepper' }),
    ],
    steps: [
      'Heat the oven to 200°C.',
      'Mix harissa, olive oil and garlic into a paste.',
      'Rub the paste all over the chicken, inside and out.',
      'Place the lemon halves inside the cavity and season generously.',
      'Roast for 1 hour 15 minutes until the juices run clear.',
      'Rest for 10 minutes before carving.',
    ],
  }),
  createRecipe({
    id: 'cauliflower-cake',
    name: 'Cauliflower Cake',
    description:
      'A savoury cake of roasted cauliflower, parmesan and fresh herbs.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Crispy_cheese_and_mustard_cauliflower_bites.jpg?v=1716838407',
    ingredients: [
      createIngredient({ name: '1 large cauliflower, broken into florets' }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'parmesan, grated',
      }),
      createIngredient({ name: '6 eggs' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'breadcrumbs',
      }),
      createIngredient({ name: 'fresh rosemary, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Roast the cauliflower at 200°C with olive oil for 25 minutes until golden.',
      'Whisk the eggs with parmesan, breadcrumbs and rosemary.',
      'Fold in the roasted cauliflower and season well.',
      'Pour into a lined 23cm cake tin.',
      'Bake at 180°C for 35 minutes until set and golden on top.',
      'Cool slightly before slicing and serving.',
    ],
  }),
  createRecipe({
    id: 'lemon-ricotta-cheesecake',
    name: 'Lemon and Ricotta Cheesecake',
    description:
      'A light, creamy cheesecake with fresh lemon zest and a biscuit base.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Lemon_and_labneh_mascarpone_layer_cake_cf3e8ada-946e-49c2-816d-6a5d6daa59fa.jpg?v=1718365412',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'digestive biscuits, crushed',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'butter, melted',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 500, unit: 'g' }),
        name: 'ricotta',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'cream cheese',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'caster sugar',
      }),
      createIngredient({ name: 'zest of 2 lemons' }),
      createIngredient({ name: '3 eggs' }),
    ],
    steps: [
      'Mix the biscuit crumbs with melted butter and press into a springform tin.',
      'Chill the base while you make the filling.',
      'Beat the ricotta, cream cheese and sugar until smooth.',
      'Add the lemon zest and eggs one at a time, mixing well.',
      'Pour over the base and bake at 160°C for 50 minutes.',
      'Cool completely, then chill for at least 4 hours before serving.',
    ],
  }),
  createRecipe({
    id: 'lamb-kofte',
    name: 'Lamb Kofte with Yogurt and Sumac',
    description:
      'Spiced lamb kofte served with a cooling yogurt sauce and sumac onions.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/lamb_kofte_2_1.jpg?v=1782907842',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 500, unit: 'g' }),
        name: 'minced lamb',
      }),
      createIngredient({ name: '1 small onion, grated' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground coriander',
      }),
      createIngredient({ name: 'fresh parsley, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'Greek yogurt',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'sumac',
      }),
    ],
    steps: [
      'Mix the lamb with onion, cumin, coriander, parsley, salt and pepper.',
      'Shape into small oval kofte and chill for 30 minutes.',
      'Grill or pan-fry the kofte for 8–10 minutes, turning regularly.',
      'Mix the yogurt with a pinch of sumac and season.',
      'Slice red onion and toss with sumac and lemon juice.',
      'Serve the kofte with yogurt sauce and sumac onions.',
    ],
  }),
  createRecipe({
    id: 'hummus-ful',
    name: 'Hummus with Ful',
    description:
      'Creamy hummus topped with warm spiced fava beans — a Ottolenghi pantry favourite.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Creamy_dreamy_hummus_621c0cf1-fdb9-4e5e-a6e6-93b60a523eac.jpg?v=1716187271',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 400, unit: 'g' }),
        name: 'tinned chickpeas, drained',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 400, unit: 'g' }),
        name: 'tinned fava beans, drained',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'lemon juice',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'cloves' }),
        name: 'garlic',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Blend the chickpeas with tahini, lemon juice, garlic and cumin until smooth.',
      'Add enough water to reach a creamy consistency and season well.',
      'Warm the fava beans in a pan with a splash of olive oil and cumin.',
      'Spread the hummus on a shallow plate and create a well in the centre.',
      'Spoon the warm ful into the well and drizzle with olive oil.',
    ],
  }),
  createRecipe({
    id: 'roasted-aubergine-tahini',
    name: 'Roasted Aubergine with Tahini and Pine Nuts',
    description:
      'Silky roasted aubergine slices with tahini dressing and toasted pine nuts.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Roasted_aubergine_with_saffron_yoghurt.jpg?v=1716561356',
    ingredients: [
      createIngredient({ name: '2 large aubergines, sliced lengthways' }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'pine nuts, toasted',
      }),
      createIngredient({ name: 'fresh mint leaves' }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tbsp' }),
        name: 'pomegranate molasses',
      }),
    ],
    steps: [
      'Brush aubergine slices with olive oil and season well.',
      'Roast at 200°C for 25 minutes until soft and golden.',
      'Mix tahini with lemon juice and water to make a sauce.',
      'Arrange the aubergine on a platter and drizzle with tahini.',
      'Scatter with pine nuts, mint and pomegranate molasses.',
    ],
  }),
  createRecipe({
    id: 'falafel',
    name: 'Falafel',
    description:
      'Crisp, herb-packed chickpea fritters, green on the inside and golden on the outside.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Falafel.jpg?v=1716187841',
    ingredients: [
      createIngredient({ name: '250g dried chickpeas, soaked overnight' }),
      createIngredient({ name: '1 small onion, roughly chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'cloves' }),
        name: 'garlic',
      }),
      createIngredient({ name: 'large bunch of parsley and coriander' }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground coriander',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 0.5, unit: 'tsp' }),
        name: 'baking powder',
      }),
      createIngredient({ name: 'sunflower oil, for frying' }),
    ],
    steps: [
      'Drain the chickpeas and pat them dry.',
      'Pulse the chickpeas, onion, garlic and herbs to a coarse paste.',
      'Stir in the spices, baking powder and a good pinch of salt.',
      'Chill the mixture for 1 hour, then shape into small patties.',
      'Fry in hot oil for 3–4 minutes until deep golden.',
      'Drain on kitchen paper and serve with tahini sauce.',
    ],
  }),
  createRecipe({
    id: 'fattoush',
    name: 'Fattoush',
    description:
      'A crunchy Levantine bread salad with sumac, herbs and a sharp lemon dressing.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Fattoush.jpg?v=1716187845',
    ingredients: [
      createIngredient({ name: '2 pitta breads, torn and toasted' }),
      createIngredient({ name: '3 tomatoes, chopped' }),
      createIngredient({ name: '1 cucumber, chopped' }),
      createIngredient({ name: '6 radishes, thinly sliced' }),
      createIngredient({ name: '4 spring onions, sliced' }),
      createIngredient({ name: 'handful of parsley and mint' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'sumac',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({ name: 'juice of 1 lemon' }),
    ],
    steps: [
      'Whisk the olive oil, lemon juice and half the sumac with some salt.',
      'Toss the vegetables and herbs together in a large bowl.',
      'Add the toasted bread and dressing just before serving.',
      'Sprinkle with the remaining sumac.',
    ],
  }),
  createRecipe({
    id: 'muhammara',
    name: 'Muhammara',
    description:
      'A sweet and smoky dip of roasted red peppers, walnuts and pomegranate molasses.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Muhammara.jpg?v=1716838421',
    ingredients: [
      createIngredient({ name: '3 red peppers' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'walnuts, toasted',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'pomegranate molasses',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'Aleppo chilli flakes',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Roast the peppers at 220°C until blackened, then peel and deseed.',
      'Blitz the peppers with the walnuts, molasses and chilli.',
      'Season and loosen with olive oil.',
    ],
  }),
  createRecipe({
    id: 'carrot-walnut-cake',
    name: 'Carrot and Walnut Cake',
    description:
      'A moist, spiced carrot cake studded with walnuts and topped with cream cheese icing.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Carrot_and_walnut_cake_2.jpg?v=1718634681',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 250, unit: 'g' }),
        name: 'grated carrots',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'plain flour',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 180, unit: 'g' }),
        name: 'light brown sugar',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: '' }),
        name: 'eggs',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'ml' }),
        name: 'sunflower oil',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'walnuts, chopped',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'ground cinnamon',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'baking powder',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'cream cheese',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 60, unit: 'g' }),
        name: 'icing sugar',
      }),
    ],
    steps: [
      'Heat the oven to 170°C and line a 23cm cake tin.',
      'Whisk the eggs, sugar and oil until smooth.',
      'Fold in the flour, baking powder and cinnamon.',
      'Stir through the carrots and walnuts.',
      'Bake for 50 minutes, then cool completely.',
      'Beat the cream cheese with icing sugar and spread over the cake.',
    ],
  }),
  createRecipe({
    id: 'chicken-shawarma-sandwiches',
    name: 'Chicken Shawarma Sandwiches',
    description:
      'Spiced roast chicken thighs wrapped in flatbread with pickles and garlic yoghurt.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/chicken_shawarma_sandwiches_cbbe5605-0f40-4264-8c50-2de6a404c6bd.jpg?v=1717325830',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 800, unit: 'g' }),
        name: 'boneless chicken thighs',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'shawarma spice mix',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({ name: '4 flatbreads' }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'Greek yoghurt',
      }),
      createIngredient({ name: '1 garlic clove, grated' }),
      createIngredient({ name: 'pickled cucumbers and turnips' }),
    ],
    steps: [
      'Toss the chicken with the spice mix, olive oil and salt.',
      'Roast at 220°C for 25 minutes until charred at the edges.',
      'Mix the yoghurt with the garlic and a pinch of salt.',
      'Slice the chicken and pile into warm flatbreads.',
      'Top with pickles and garlic yoghurt, then roll up tightly.',
    ],
  }),
  createRecipe({
    id: 'aubergine-curry',
    name: 'Aubergine Curry',
    description:
      'Soft aubergine simmered in a fragrant coconut and tomato curry sauce.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Aubergine_curry.jpg?v=1716838458',
    ingredients: [
      createIngredient({ name: '2 aubergines, cut into chunks' }),
      createIngredient({ name: '1 onion, finely chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'cloves' }),
        name: 'garlic, crushed',
      }),
      createIngredient({ name: 'thumb of ginger, grated' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'curry powder',
      }),
      createIngredient({ name: '400g tinned chopped tomatoes' }),
      createIngredient({
        quantity: createQuantity({ amount: 400, unit: 'ml' }),
        name: 'coconut milk',
      }),
      createIngredient({ name: 'fresh coriander, to serve' }),
    ],
    steps: [
      'Roast the aubergine chunks with oil at 220°C for 25 minutes.',
      'Fry the onion until soft, then add the garlic, ginger and curry powder.',
      'Add the tomatoes and coconut milk and simmer for 15 minutes.',
      'Stir in the aubergine and cook for 5 more minutes.',
      'Scatter with coriander and serve with rice.',
    ],
  }),
  createRecipe({
    id: 'zaatar-salmon-tahini',
    name: "Za'atar Salmon with Tahini",
    description:
      "Roast salmon fillets crusted with za'atar and served with a lemony tahini sauce.",
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Za_atar_salmon_and_tahini.jpg?v=1716838611',
    ingredients: [
      createIngredient({ name: '4 salmon fillets' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: "za'atar",
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({ name: 'juice of 1 lemon' }),
    ],
    steps: [
      "Rub the salmon with olive oil, za'atar and salt.",
      'Roast at 200°C for 10–12 minutes.',
      'Whisk the tahini with lemon juice and water until pourable.',
      'Serve the salmon with the tahini sauce spooned over.',
    ],
  }),
  createRecipe({
    id: 'ginger-egg-fried-rice',
    name: 'Ginger Egg Fried Rice',
    description:
      'A quick wok-fried rice with plenty of ginger, spring onions and soft scrambled egg.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Ginger_egg_fried_rice.jpg?v=1716838512',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 500, unit: 'g' }),
        name: 'cooked rice, cold',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: '' }),
        name: 'eggs, beaten',
      }),
      createIngredient({ name: '40g ginger, finely julienned' }),
      createIngredient({ name: '6 spring onions, sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'soy sauce',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'vegetable oil',
      }),
    ],
    steps: [
      'Fry the ginger in hot oil until crisp and golden, then set aside.',
      'Scramble the eggs in the same wok until just set.',
      'Add the rice and stir-fry until piping hot.',
      'Season with soy sauce and toss through the spring onions and crispy ginger.',
    ],
  }),
  createRecipe({
    id: 'mee-goreng',
    name: 'Mee Goreng',
    description:
      'Sweet, spicy and savoury fried noodles with tofu, greens and a fried egg on top.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/mee-goreng_15da9aae-2a68-4f57-ae12-a3648fc6e9aa.jpg?v=1715244806',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 300, unit: 'g' }),
        name: 'egg noodles',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'firm tofu, cubed',
      }),
      createIngredient({ name: '2 heads of pak choi, quartered' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'kecap manis',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tbsp' }),
        name: 'sambal oelek',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'cloves' }),
        name: 'garlic, sliced',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: '' }),
        name: 'eggs',
      }),
      createIngredient({ name: 'lime wedges, to serve' }),
    ],
    steps: [
      'Cook the noodles, drain and rinse under cold water.',
      'Fry the tofu until golden on all sides.',
      'Add the garlic and pak choi and stir-fry for 2 minutes.',
      'Add the noodles, kecap manis and sambal and toss until glossy.',
      'Fry the eggs separately until the edges are crisp.',
      'Serve the noodles topped with an egg and lime wedges.',
    ],
  }),
  createRecipe({
    id: 'irish-stew',
    name: 'Irish Stew',
    description:
      'A slow-cooked, comforting stew of lamb, potatoes and root vegetables.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Irish_stew.jpg?v=1717600014',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'kg' }),
        name: 'lamb neck, cut into chunks',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 800, unit: 'g' }),
        name: 'potatoes, peeled and chunked',
      }),
      createIngredient({ name: '3 carrots, sliced' }),
      createIngredient({ name: '2 onions, sliced' }),
      createIngredient({ name: 'few sprigs of thyme' }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'l' }),
        name: 'lamb or chicken stock',
      }),
      createIngredient({ name: 'chopped parsley, to serve' }),
    ],
    steps: [
      'Brown the lamb in batches in a heavy casserole.',
      'Soften the onions in the same pan.',
      'Return the lamb, add the carrots, thyme and stock and bring to a simmer.',
      'Cover and cook gently for 1 hour.',
      'Add the potatoes and cook for 45 minutes more until tender.',
      'Season and scatter with parsley.',
    ],
  }),
  createRecipe({
    id: 'pork-souvlaki',
    name: 'Pork Souvlaki with Cucumber Salad',
    description:
      'Oregano and lemon marinated pork skewers with a crunchy cucumber salad and tzatziki.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Pork_souvlaki_with_cucumber_salad_and_tzatziki.jpg?v=1717600186',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 600, unit: 'g' }),
        name: 'pork shoulder, cubed',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'dried oregano',
      }),
      createIngredient({ name: 'juice and zest of 1 lemon' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({ name: '1 cucumber' }),
      createIngredient({ name: '1 red onion, thinly sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'tzatziki',
      }),
    ],
    steps: [
      'Marinate the pork with oregano, lemon, olive oil and salt for 1 hour.',
      'Thread onto skewers and grill for 10–12 minutes, turning often.',
      'Chop the cucumber and toss with the red onion and a pinch of salt.',
      'Serve the skewers with the salad and tzatziki.',
    ],
  }),
  createRecipe({
    id: 'green-chilli-con-carne',
    name: 'Green Chilli Con Carne with Cornbread',
    description:
      'A fresh, green twist on chilli con carne served with warm buttery cornbread.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Green_chilli_con_carne_with_warm_cornbread.jpg?v=1716187857',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 500, unit: 'g' }),
        name: 'minced beef',
      }),
      createIngredient({ name: '1 onion, chopped' }),
      createIngredient({ name: '3 green chillies, chopped' }),
      createIngredient({ name: '2 green peppers, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({ name: '400g tinned white beans, drained' }),
      createIngredient({ name: 'large bunch of coriander' }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'cornmeal',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 250, unit: 'ml' }),
        name: 'buttermilk',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 60, unit: 'g' }),
        name: 'melted butter',
      }),
    ],
    steps: [
      'Brown the beef, then add the onion, chillies and peppers.',
      'Stir in the cumin and cook for 2 minutes.',
      'Add the beans and a splash of water and simmer for 30 minutes.',
      'Mix the cornmeal, buttermilk and butter and bake at 200°C for 20 minutes.',
      'Blitz the coriander with a little oil and stir into the chilli.',
      'Serve the chilli with wedges of warm cornbread.',
    ],
  }),
  createRecipe({
    id: 'chickpea-tomato-bread-soup',
    name: 'Chickpea, Tomato and Bread Soup',
    description:
      'A thick, rustic soup that turns stale bread, chickpeas and tomatoes into comfort food.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Chickpea_tomato_and_bread_soup.jpg?v=1716561264',
    ingredients: [
      createIngredient({ name: '1 onion, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'cloves' }),
        name: 'garlic, sliced',
      }),
      createIngredient({ name: '800g tinned chopped tomatoes' }),
      createIngredient({ name: '400g tinned chickpeas, drained' }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'stale sourdough, torn',
      }),
      createIngredient({ name: 'basil leaves' }),
    ],
    steps: [
      'Soften the onion and garlic in olive oil.',
      'Add the tomatoes, chickpeas and 500ml water and simmer for 20 minutes.',
      'Stir in the bread and cook until it breaks down and thickens the soup.',
      'Finish with basil and a generous drizzle of olive oil.',
    ],
  }),
  createRecipe({
    id: 'dakos',
    name: 'Dakos',
    description:
      'A Cretan salad of barley rusks topped with grated tomato, feta, olives and oregano.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/dakos_abd9e37f-a79e-47ba-a834-ffdf0070d388.jpg?v=1716187829',
    ingredients: [
      createIngredient({ name: '4 barley rusks' }),
      createIngredient({ name: '4 ripe tomatoes' }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'feta, crumbled',
      }),
      createIngredient({ name: 'handful of Kalamata olives' }),
      createIngredient({ name: 'dried oregano' }),
    ],
    steps: [
      'Sprinkle the rusks with a little water and olive oil to soften.',
      'Grate the tomatoes, season and spoon over the rusks.',
      'Top with feta, olives and oregano.',
    ],
  }),
  createRecipe({
    id: 'spicy-mushroom-lasagne',
    name: 'Spicy Mushroom Lasagne',
    description:
      'A rich vegetarian lasagne layered with spiced mushroom ragù and creamy béchamel.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Spicy_mushroom_lasagne.jpg?v=1716188132',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 800, unit: 'g' }),
        name: 'mixed mushrooms, chopped',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 20, unit: 'g' }),
        name: 'dried porcini, soaked',
      }),
      createIngredient({ name: '1 onion, finely chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'rose harissa',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'tomato paste',
      }),
      createIngredient({ name: '12 lasagne sheets' }),
      createIngredient({
        quantity: createQuantity({ amount: 600, unit: 'ml' }),
        name: 'béchamel sauce',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 80, unit: 'g' }),
        name: 'Parmesan, grated',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 125, unit: 'g' }),
        name: 'mozzarella, torn',
      }),
    ],
    steps: [
      'Fry the onion until soft, then add the mushrooms and cook until browned.',
      'Chop the porcini and add with their soaking liquid, harissa and tomato paste.',
      'Simmer the ragù for 20 minutes until thick.',
      'Layer the ragù, lasagne sheets and béchamel in a baking dish.',
      'Finish with béchamel, Parmesan and mozzarella.',
      'Bake at 200°C for 35 minutes until bubbling.',
      'Rest for 10 minutes before slicing.',
    ],
  }),
  createRecipe({
    id: 'lemon-raspberry-bars',
    name: 'Lemon and Raspberry Bars',
    description:
      'Buttery shortbread topped with a zingy lemon curd and fresh raspberries.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Lemon-and-raspberry-bars.jpg?v=1715244795',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'plain flour',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 125, unit: 'g' }),
        name: 'cold butter, cubed',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 220, unit: 'g' }),
        name: 'caster sugar',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: '' }),
        name: 'eggs',
      }),
      createIngredient({ name: 'zest and juice of 3 lemons' }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'raspberries',
      }),
    ],
    steps: [
      'Rub the flour, butter and a third of the sugar into crumbs.',
      'Press into a lined tin and bake at 180°C for 20 minutes.',
      'Whisk the eggs, remaining sugar, lemon zest and juice.',
      'Scatter raspberries over the base and pour over the lemon mixture.',
      'Bake at 160°C for 25 minutes until just set, then chill before slicing.',
    ],
  }),
  createRecipe({
    id: 'tahini-halva-brownies',
    name: 'Tahini and Halva Brownies',
    description:
      'Fudgy chocolate brownies swirled with tahini and studded with crumbly halva.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Halva_brownies.jpg?v=1716187894',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'dark chocolate',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'butter',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 250, unit: 'g' }),
        name: 'caster sugar',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: '' }),
        name: 'eggs',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 80, unit: 'g' }),
        name: 'plain flour',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'halva, crumbled',
      }),
    ],
    steps: [
      'Melt the chocolate and butter together.',
      'Whisk the eggs and sugar until pale, then fold in the chocolate.',
      'Fold in the flour and pour into a lined tin.',
      'Dot with tahini, swirl with a skewer and scatter over the halva.',
      'Bake at 180°C for 25 minutes, keeping the centre fudgy.',
    ],
  }),
  createRecipe({
    id: 'ricotta-hotcakes',
    name: 'Ricotta Hotcakes',
    description:
      'Light, fluffy ricotta pancakes served with honey and fresh berries.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Ricotta_hotcakes.jpg?v=1716561347',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 250, unit: 'g' }),
        name: 'ricotta',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: '' }),
        name: 'eggs, separated',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'plain flour',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'ml' }),
        name: 'milk',
      }),
      createIngredient({ name: 'honey and berries, to serve' }),
    ],
    steps: [
      'Mix the ricotta, egg yolks, milk and flour.',
      'Whisk the egg whites to soft peaks and fold into the batter.',
      'Cook spoonfuls in a buttered pan for 2 minutes on each side.',
      'Serve warm with honey and berries.',
    ],
  }),
  createRecipe({
    id: 'vegetable-makloubeh',
    name: 'Vegetable Makloubeh',
    description:
      'A showstopping upside-down rice dish layered with fried aubergine, cauliflower and tomatoes.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Vegetable_Makloubeh.jpg?v=1716187506',
    ingredients: [
      createIngredient({ name: '1 aubergine, sliced' }),
      createIngredient({ name: '1 small cauliflower, cut into florets' }),
      createIngredient({ name: '2 tomatoes, sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 300, unit: 'g' }),
        name: 'basmati rice, soaked',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground turmeric',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'baharat spice mix',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 600, unit: 'ml' }),
        name: 'vegetable stock',
      }),
      createIngredient({ name: 'toasted almonds and parsley, to serve' }),
    ],
    steps: [
      'Fry or roast the aubergine and cauliflower until golden.',
      'Line the base of a large pan with the tomato slices.',
      'Layer the vegetables over the tomatoes.',
      'Mix the rice with the spices and spread it over the vegetables.',
      'Pour in the stock, cover and cook on low heat for 30 minutes.',
      'Rest for 10 minutes, then invert onto a large platter.',
      'Scatter with almonds and parsley.',
    ],
  }),
  createRecipe({
    id: 'pea-leek-soup',
    name: 'Pea and Leek Soup with Basil Oil',
    description:
      'A vibrant green soup of sweet peas and leeks finished with fragrant basil oil.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Pea_and_leek_soup_with_basil_oil.jpg?v=1716187379',
    ingredients: [
      createIngredient({ name: '2 leeks, sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 500, unit: 'g' }),
        name: 'frozen peas',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'l' }),
        name: 'vegetable stock',
      }),
      createIngredient({ name: 'large bunch of basil' }),
      createIngredient({
        quantity: createQuantity({ amount: 80, unit: 'ml' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Sweat the leeks in a little oil until soft.',
      'Add the peas and stock and simmer for 5 minutes.',
      'Blend until smooth and season.',
      'Blitz the basil with the olive oil and drizzle over the soup.',
    ],
  }),
];
