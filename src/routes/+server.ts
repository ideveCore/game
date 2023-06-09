/** @type {import('./$types').RequestHandler} */
import { json } from "@sveltejs/kit";

export const prerender = true;

export function GET(event: any) {
  const href_server = event.url.href;

  let images_list = [
    {
      name: 'Eiffel Tower',
      image: `${href_server}eiffel-tower.jpg`,
      current: false,
    },
    {
      name: 'Christ the Redeemer',
      image: `${href_server}christ-the-redeemer.png`,
      current: false,
    },
    {
      name: 'New York',
      image: `${href_server}new-york.png`,
      current: false,
    },
    {
      name: 'Miami',
      image: `${href_server}miami.jpg`,
      current: false,
    },
    {
      name: 'Notre Dame',
      image: `${href_server}notre-dame.png`,
      current: false,
    },
  ];
  let animal_list = [
    {
      name: 'hyena',
      image: `${href_server}hyena.png`
    },
    {
      name: 'lion',
      image: `${href_server}lion.png`
    },
    {
      name: 'monkey',
      image: `${href_server}monkey.png`
    },
    {
      name: 'orca',
      image: `${href_server}orca.png`
    },
    {
      name: 'snake',
      image: `${href_server}snake.png`
    },
    {
      name: 'whale',
      image: `${href_server}whale.png`
    },
  ];

  const array: any[] = [];
  const shuffle = (array: any) => (array.sort(() => Math.random() - 0.5));
  const sort_images = () => {
    const current_image = (() => (images_list[Math.round(Math.random() * (images_list.length -1))]))();
    const images_array = shuffle(images_list.filter((item) => item.name !== current_image.name));
    return shuffle([
      { name: current_image.name, image: current_image.image, current: true},
      { ...images_array[0]},
      { ...images_array[1]},
      { ...images_array[2]}
    ])
  }

  for(let i = 0; i <=5; i++) {
    const current_animal: { name: string, image: string } = animal_list[i];
    array.push({
      open: false,
      animal: current_animal.name,
      image: current_animal.image,
      matched: {
        state: false,
        macthed_with: current_animal,
      }
    })
    array.push({
      open: false,
      animal: current_animal.name,
      image: current_animal.image,
      matched: {
        state: false,
        macthed_with: current_animal,
      }
    })
  }

  return json({
    array: shuffle(array),
    current_image: sort_images(),
  })
}