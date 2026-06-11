export interface MenuItem {
  id?: number;
  name: string;
  price?: number;
  /** Optional override price used in dine-in mode. Falls back to `price` when not set. */
  dineInPrice?: number;
  category?: string;
  image?: string;
  thumbnailImage?: string;
  description?: string;
  desc?: string;
}

export type PrinterKey = 'crepe' | 'kitchen' | 'bar';

const CATEGORY_PRINTER_MAP: Record<string, PrinterKey> = {
  TOASTS_CREPS:   'crepe',
  BREAKFAST:      'kitchen',
  CLUB_SANDWICH:  'kitchen',
  JUNIOR_MENU:    'kitchen',
  PINSA:          'kitchen',
  PASTA:          'kitchen',
  HOTDOG_BURGERS: 'kitchen',
  BAO_BUNS:       'kitchen',
  SALADS:         'kitchen',
  MAIN_COURSES:   'kitchen',
  COFFEES:        'bar',
  SOFT_DRINKS:    'bar',
  JUICES:         'bar',
  BEERS:          'bar',
  DRINKS_WINES:   'bar',
  Cocktails:      'bar',
  Mocktails:      'bar',
};

/** Returns the printer key for a given menu item category. Defaults to 'kitchen'. */
export function getPrinterForCategory(category: string | undefined): PrinterKey {
  return CATEGORY_PRINTER_MAP[category ?? ''] ?? 'kitchen';
}

export const menuItems: MenuItem[] = [
  { id: 51, name: 'TOAST', price: 2.5, category: 'TOASTS_CREPS', image: 'https://21images.s3.eu-north-1.amazonaws.com/toast.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/toast.webp', description: 'TOAST_DESC' },
  { id: 52, name: 'SAVORY_CREPE', price: 3, category: 'TOASTS_CREPS', image: 'https://21images.s3.eu-north-1.amazonaws.com/almiri.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/almiri.webp', description: 'SAVORY_CREPE_DESC' },
  { id: 53, name: 'SWEET_CREPE', price: 3.5, category: 'TOASTS_CREPS', image: 'https://21images.s3.eu-north-1.amazonaws.com/crepeglykiaa.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/crepeglykiaa.webp', description: 'SWEET_CREPE_DESC' },

  { id: 101, name: 'OMELETTE', price: 7.5, category: 'BREAKFAST', image: 'https://21images.s3.eu-north-1.amazonaws.com/omeletee.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/omeletee.webp', description: 'OMELETTE_DESC' },
  { id: 204, name: 'TRADITIONAL_KAYANAS', price: 8, category: 'BREAKFAST', description: 'TRADITIONAL_KAYANAS_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/kayanas.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/kayanas.webp' },
  { id: 109, name: 'FRIED_EGGS_BACON', price: 7, category: 'BREAKFAST', image: 'https://21images.s3.eu-north-1.amazonaws.com/augaa.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/augaa.webp', description: 'FRIED_EGGS_BACON_DESC' },
  { id: 102, name: 'SCRAMBLED_EGGS', price: 7, category: 'BREAKFAST', description: 'SCRAMBLED_EGGS_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/scrabll.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/scrabll.webp' },
  { id: 103, name: 'SCRAMBLED_EGGS_SALMON', price: 8, category: 'BREAKFAST', description: 'SCRAMBLED_EGGS_SALMON_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/salmonbr.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/salmonbr.webp' },
  { id: 106, name: 'PANCAKE_PRALINE', price: 7.5, category: 'BREAKFAST', image: 'https://21images.s3.eu-north-1.amazonaws.com/pancakee.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/pancakee.webp', description: 'PANCAKE_PRALINE_DESC' },
  { id: 107, name: 'PANCAKE_HONEY_CINNAMON', price: 7.5, category: 'BREAKFAST', image: 'https://21images.s3.eu-north-1.amazonaws.com/panmelikanela.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/panmelikanela.webp'},
  { id: 108, name: 'PANCAKE_PRALINE_BANANA_HAZELNUT', price: 9, category: 'BREAKFAST' , image: 'https://21images.s3.eu-north-1.amazonaws.com/panfountoukia.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/panfountoukia.webp'},
  { id: 203, name: 'PANCAKE_SAVORY', price: 9, category: 'BREAKFAST', description: 'PANCAKE_SAVORY_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/pancakeAlmiro.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/pancakeAlmiro.webp' },
  { id: 104, name: 'FRENCH_TOAST_SIMPLE', price: 7, image: 'https://21images.s3.eu-north-1.amazonaws.com/frenchtoast.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/frenchtoast.webp', category: 'BREAKFAST', description: 'FRENCH_TOAST_SIMPLE_DESC' },
  { id: 105, name: 'FRENCH_TOAST_HONEY_CINNAMON', price: 7, category: 'BREAKFAST', image: 'https://21images.s3.eu-north-1.amazonaws.com/french+toast+meli.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/french+toast+meli.webp', description: 'FRENCH_TOAST_HONEY_CINNAMON_DESC' },
  { id: 111, name: 'YOGURT_HONEY_WALNUTS_FRUITS', price: 7, category: 'BREAKFAST', image: 'https://21images.s3.eu-north-1.amazonaws.com/giaourtii.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/giaourtii.webp', description: 'YOGURT_HONEY_WALNUTS_FRUITS_DESC' },
  { id: 205, name: 'YOGURT_MUESLI_HONEY', price: 7, category: 'BREAKFAST', description: 'YOGURT_MUESLI_HONEY_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/musli.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/musli.webp'},
  { id: 206, name: 'BREAKFAST_FOR_2', price: 25, category: 'BREAKFAST', description: 'BREAKFAST_FOR_2_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/plato.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/plato.webp' },

  { id: 112, name: 'CLUB_SANDWICH', price: 10.5, category: 'CLUB_SANDWICH', description: 'CLUB_SANDWICH_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/club.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/club.webp' },
  { id: 113, name: 'CLUB_SANDWICH_CAESAR_CHICKEN', price: 12.5, category: 'CLUB_SANDWICH', description: 'CLUB_SANDWICH_CAESAR_CHICKEN_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/clubCeasars.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/clubCeasars.webp' },
  { id: 114, name: 'CLUB_SANDWICH_GYRO', price: 12.5, category: 'CLUB_SANDWICH', description: 'CLUB_SANDWICH_GYRO_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/gyrosclub.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/gyrosclub.webp' },
  { id: 115, name: 'CLUB_SANDWICH_PANSETSA', price: 13, category: 'CLUB_SANDWICH', image: 'https://21images.s3.eu-north-1.amazonaws.com/clubpanseta.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/clubpanseta.webp', description: 'CLUB_SANDWICH_PANSETSA_DESC' },
  { id: 118, name: 'CLUB_CALAMARI', price: 12, category: 'CLUB_SANDWICH', description: 'CLUB_CALAMARI_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/kalamariclub.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/kalamariclub.webp' },

  { id: 116, name: 'JUNIOR_1', price: 7.5, category: 'JUNIOR_MENU', description: 'JUNIOR_1_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/juniorburger.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/juniorburger.webp'},
  { id: 117, name: 'JUNIOR_2', price: 7.5, category: 'JUNIOR_MENU', description: 'JUNIOR_2_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/juniornuggets.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/juniornuggets.webp'},

  { id: 125, name: 'PINSA_21', price: 14, category: 'PINSA', image: 'https://21images.s3.eu-north-1.amazonaws.com/pinsa21.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/pinsa21.webp', description: 'PINSA_21_DESC' },
  { id: 124, name: 'PINSA_SPECIAL', price: 13, category: 'PINSA', description: 'PINSA_SPECIAL_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/special.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/special.webp' },
  { id: 233, name: 'PINSA_PEPPERONI', price: 12.5, category: 'PINSA', description: 'PINSA_PEPPERONI_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/peperoni.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/peperoni.webp' },
  { id: 123, name: 'PINSA_MARGARITA', price: 12, category: 'PINSA', description: 'PINSA_MARGARITA_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/margarita.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/margarita.webp' },

  { id: 127, name: 'BOLOGNESE', price: 11, category: 'PASTA', description: 'BOLOGNESE_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/bolognese.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/bolognese.webp' },
  { id: 128, name: 'CARBONARA', price: 11, category: 'PASTA', description: 'CARBONARA_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/carbonara.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/carbonara.webp' },
  { id: 131, name: 'PASTA_21', price: 11, category: 'PASTA', description: 'PASTA_21_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/pasta21new.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/pasta21new.webp' },
  { id: 129, name: 'penesMeKotopoulo', price: 12, category: 'PASTA', description: 'penesMeKotopouloDesc', image: 'https://21images.s3.eu-north-1.amazonaws.com/peneskoto.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/peneskoto.webp' },
  { id: 130, name: 'rigatoniCheeses', price: 11, category: 'PASTA', description: 'rigatoniCheesesDesc', image: 'https://21images.s3.eu-north-1.amazonaws.com/penes4tiria.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/penes4tiria.webp' },
  { id: 132, name: 'SHRIMP_PASTA', price: 19, category: 'PASTA', image: 'https://21images.s3.eu-north-1.amazonaws.com/garidomakaronada.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/garidomakaronada.webp', description: 'SHRIMP_PASTA_DESC' },
  { id: 230, name: 'SEAFOOD_PASTA', price: 19, category: 'PASTA', description: 'SEAFOOD_PASTA_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/thalasinon.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/thalasinon.webp'},

  { id: 136, name: 'HOT_DOG', price: 7, category: 'HOTDOG_BURGERS', description: 'HOT_DOG_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/hot-dog.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/hot-dog.webp'},
  { id: 137, name: 'BURGER_BBQ', price: 11.5, category: 'HOTDOG_BURGERS', description: 'BURGER_BBQ_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/bbqBurger.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/bbqBurger.webp' },
  { id: 138, name: 'BURGER_CAESAR', price: 11.5, category: 'HOTDOG_BURGERS', description: 'BURGER_CAESAR_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/ceasarsBurger.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/ceasarsBurger.webp' },
  { id: 139, name: 'BURGER_21', price: 12.5, category: 'HOTDOG_BURGERS', image: 'https://21images.s3.eu-north-1.amazonaws.com/burger.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/burger.webp', description: 'BURGER_21_DESC' },
  { id: 140, name: 'DOUBLE_CHEESE_BURGER', price: 11.5, category: 'HOTDOG_BURGERS', description: 'DOUBLE_CHEESE_BURGER_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/burgerCheese.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/burgerCheese.webp' },
  { id: 141, name: 'CHICKEN_CRISPY_BURGER', price: 11.5, category: 'HOTDOG_BURGERS', description: 'CHICKEN_CRISPY_BURGER_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/crispyburger.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/crispyburger.webp' },
  { id: 142, name: 'burgerChilicrispychicken', price: 12.5, category: 'HOTDOG_BURGERS', description: 'burgerChilicrispychickenDesc', image: 'https://21images.s3.eu-north-1.amazonaws.com/crispyBurger.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/crispyBurger.webp' },
  { id: 143, name: 'doubleSmash', price: 12.5, category: 'HOTDOG_BURGERS', description: 'doubleSmashdesc', image: 'https://21images.s3.eu-north-1.amazonaws.com/smash.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/smash.webp' },
  // { id: 144, name: 'miniBurgers', price: 11, category: 'HOTDOG_BURGERS', description: 'miniBurgersDesc' },

  { id: 145, name: 'SHRIMP_CHILI_BAO', price: 9, category: 'BAO_BUNS', image: 'https://21images.s3.eu-north-1.amazonaws.com/baogarida.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/baogarida.webp', description: 'SHRIMP_CHILI_BAO_DESC' },
  { id: 146, name: 'NUGGETS_BAO', price: 8, category: 'BAO_BUNS', image: 'https://21images.s3.eu-north-1.amazonaws.com/baokota.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/baokota.webp', description: 'NUGGETS_BAO_DESC' },
  { id: 147, name: 'PULLED_PORK_BAO', price: 8, category: 'BAO_BUNS', image: 'https://21images.s3.eu-north-1.amazonaws.com/baopull.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/baopull.webp', description: 'PULLED_PORK_BAO_DESC' },

  { id: 148, name: 'SALAD_CAESAR', price: 10.5, category: 'SALADS', description: 'SALAD_CAESAR_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/saladcaesar.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/saladcaesar.webp'},
  { id: 149, name: 'SALAD_21', price: 11, category: 'SALADS', image: 'https://21images.s3.eu-north-1.amazonaws.com/saladd+21.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/saladd+21.webp', description: 'SALAD_21_DESC' },
  { id: 150, name: 'SALAD_CAPRESE', price: 9, category: 'SALADS', description: 'SALAD_CAPRESE_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/caprese.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/caprese.webp' },
  { id: 151, name: 'SALAD_KOUKOUVAGIA', price: 9, category: 'SALADS', description: 'SALAD_KOUKOUVAGIA_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/koukouvagia.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/koukouvagia.webp' },
  { id: 152, name: 'SALAD_GREEK', price: 9, category: 'SALADS', description: 'SALAD_GREEK_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/xwriatiki.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/xwriatiki.webp'},
  { id: 231, name: 'SALAD_CHEF', price: 11, category: 'SALADS', description: 'SALAD_CHEF_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/chef.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/chef.webp' },
  { id: 232, name: 'SALAD_21_SHRIMP', price: 11, category: 'SALADS', description: 'SALAD_21_SHRIMP_DESC' , image: 'https://21images.s3.eu-north-1.amazonaws.com/salad21garides.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/salad21garides.webp'},

  { id: 154, name: 'PORK_PANSETTO', price: 18, category: 'MAIN_COURSES', description: 'PORK_PANSETTO_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/pansetomprizolaa.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/pansetomprizolaa.webp' },
  { id: 156, name: 'CHICKEN_NUGGETS', price: 12, category: 'MAIN_COURSES', image: 'https://21images.s3.eu-north-1.amazonaws.com/nuggets.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/nuggets.webp', description: 'CHICKEN_NUGGETS_DESC' },
  { id: 157, name: 'CHICKEN_NUGGETS_A_LA_CREME', price: 13, category: 'MAIN_COURSES', image: 'https://21images.s3.eu-north-1.amazonaws.com/alacreme.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/alacreme.webp', description: 'CHICKEN_NUGGETS_A_LA_CREME_DESC' },
  { id: 158, name: 'FRIED_CALAMARI', price: 12, category: 'MAIN_COURSES', image: 'https://21images.s3.eu-north-1.amazonaws.com/kalamari.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/kalamari.webp', description: 'FRIED_CALAMARI_DESC' },
  { id: 159, name: 'SALMON_TERIYAKI', price: 18, category: 'MAIN_COURSES', image: 'https://21images.s3.eu-north-1.amazonaws.com/solomos.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/solomos.webp', description: 'SALMON_TERIYAKI_DESC' },
  { id: 160, name: 'CHICKEN_THIGH', price: 13, category: 'MAIN_COURSES', description: 'CHICKEN_THIGH_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/fileto+mpouti.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/fileto+mpouti.webp' },
  { id: 161, name: 'BEEF_PATTY', price: 12.5, category: 'MAIN_COURSES', description: 'BEEF_PATTY_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/mpiftekiaa.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/mpiftekiaa.webp' },
  { id: 162, name: 'PORK_GYRO', price: 12, category: 'MAIN_COURSES', description: 'PORK_GYRO_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/gyros.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/gyros.webp' },
  { id: 163, name: 'MIX_GRILL', price: 18, category: 'MAIN_COURSES', description: 'MIX_GRILL_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/grill.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/grill.webp' },

  // { id: 165, name: 'Burger Λαχανικών (Νηστίσιμο)', price: 9, category: 'LENT_MENU', description: 'BURGER_VEGETABLES_DESC' },
  // { id: 166, name: 'Row No Meat Burger (Νηστίσιμο)', price: 11, category: 'LENT_MENU', description: 'ROW_NO_MEAT_BURGER_DESC' },
  // { id: 167, name: 'Napolitana (Νηστίσιμο)', price: 8, category: 'LENT_MENU', description: 'NAPOLITANA_LENT_DESC' },
  // { id: 168, name: 'Λιγκουίνι με Θαλασσινά (Νηστίσιμο)', price: 18, category: 'LENT_MENU', description: '' },
  // { id: 169, name: 'Γαριδομακαρονάδα (Νηστίσιμο)', price: 18, category: 'LENT_MENU', description: '' },
  // { id: 170, name: 'Κουκουβάγια Salad (Νηστίσιμο)', price: 8, category: 'LENT_MENU', description: 'KOUKOUVAGIA_SALAD_LENT_DESC' },
  // { id: 171, name: '21 Salad με Γαρίδες (Νηστίσιμο)', price: 10, category: 'LENT_MENU', description: 'SALAD_21_SHRIMP_DESC' },
  // { id: 172, name: 'Πέννες Salad (Νηστίσιμο)', price: 10, category: 'LENT_MENU', description: 'PENNE_SALAD_DESC' },
  // { id: 173, name: 'Pinsa Χωριάτικη (Νηστίσιμο)', price: 12, category: 'LENT_MENU', description: 'PINSA_GREEK_LENT_DESC' },
  // { id: 174, name: 'Pinsa Νηστίσιμη (Νηστίσιμο)', price: 11, category: 'LENT_MENU', description: 'PINSA_LENTEN_DESC' },
  // { id: 175, name: 'Bao Buns Γαρίδας (Νηστίσιμο)', price: 8, category: 'LENT_MENU', description: 'BAO_BUNS_SHRIMP_LENT_DESC' },
  // { id: 176, name: 'Club Καλαμάρι (Νηστίσιμο)', price: 12, category: 'LENT_MENU', description: 'CLUB_CALAMARI_DESC' },
  // { id: 177, name: 'Mix Grill (Νηστίσιμο)', price: 18, category: 'LENT_MENU', description: 'MIX_GRILL_LENT_DESC' },
  // { id: 178, name: 'Πατάτες Country (Νηστίσιμο)', price: 6, category: 'LENT_MENU', description: 'COUNTRY_POTATOES_DESC' },

  { id: 1, name: 'Freddo espresso', price: 2.5, category: 'COFFEES', dineInPrice: 3.5 },
  { id: 2, name: 'Freddo cappuccino', price: 3, category: 'COFFEES', dineInPrice: 4 },
  { id: 3, name: 'Espresso', price: 2, category: 'COFFEES', dineInPrice: 3 },
  { id: 4, name: 'Cappuccino', price: 2.5, category: 'COFFEES', dineInPrice: 3.5 },
  { id: 5, name: 'Americano', price: 2.5, category: 'COFFEES', dineInPrice: 3.5 },
  { id: 6, name: 'HELLENIKOS', price: 1.5, category: 'COFFEES', dineInPrice: 2.5 },
  { id: 7, name: 'CHOCOLATE', price: 3, category: 'COFFEES', dineInPrice: 4 },
  { id: 8, name: 'Nescafe', price: 2.5, category: 'COFFEES', dineInPrice: 3.5 },
  { id: 9, name: 'NESCAFE_FRAPE', price: 2.5, category: 'COFFEES', dineInPrice: 3.5 },
  { id: 10, name: 'Latte', price: 3.5, category: 'COFFEES', dineInPrice: 4.5 },
  { id: 11, name: 'FILTER_COFFEE', price: 2.5, category: 'COFFEES', dineInPrice: 3.5 },
  { id: 12, name: 'COCOA', price: 2, category: 'COFFEES', dineInPrice: 3 },
  { id: 13, name: 'Macchiato', price: 2, category: 'COFFEES', dineInPrice: 3 },
  { id: 14, name: 'VIENNESE_CHOCOLATE', price: 3.5, category: 'COFFEES', dineInPrice: 4.5 },

  { id: 15, name: 'FANTA_ORANGE', price: 2.5, category: 'SOFT_DRINKS' ,dineInPrice: 3.5 },
  { id: 16, name: 'SPRITE', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 17, name: 'FANTA_LEMON', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 18, name: 'COCA_COLA', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 19, name: 'COCA_COLA_ZERO', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 20, name: 'PEACH_TEA', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 21, name: 'LEMON_TEA', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 22, name: 'GREEN_TEA', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 23, name: 'RED_BULL', price: 4, category: 'SOFT_DRINKS', dineInPrice: 5 },
  { id: 24, name: 'SODA', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 25, name: 'WATER_SMALL', price: 0.5, category: 'SOFT_DRINKS', dineInPrice: 1 },
  { id: 26, name: 'WATER_LARGE', price: 1, category: 'SOFT_DRINKS', dineInPrice: 1.5 },
  { id: 27, name: 'PERRIER', price: 3, category: 'SOFT_DRINKS', dineInPrice: 4 },
  { id: 28, name: 'SCHWEPPES_ORANGE', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 29, name: 'SCHWEPPES_LEMON', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 30, name: 'SCHWEPPES_PINK', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 31, name: 'TONIC', price: 2.5, category: 'SOFT_DRINKS', dineInPrice: 3.5 },
  { id: 32, name: 'THREE_CENTS_PINK', price: 3.5, category: 'SOFT_DRINKS', dineInPrice: 4.5 },
  { id: 33, name: 'THREE_CENTS_GINGER', price: 3.5, category: 'SOFT_DRINKS', dineInPrice: 4.5 },

  { id: 40, name: 'FRESH_JUICE', price: 4, category: 'JUICES', dineInPrice: 5 },
  { id: 41, name: 'ORANGE_JUICE', price: 2.5, category: 'JUICES',dineInPrice: 3.5 },
  { id: 42, name: 'MIXED_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 43, name: 'SOUR_CHERRY_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 44, name: 'BANANA_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 45, name: 'APPLE_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 46, name: 'PINEAPPLE_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 47, name: 'APRICOT_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 48, name: 'PEACH_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 49, name: 'MANDARIN_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },
  { id: 50, name: 'STRAWBERRY_JUICE', price: 2.5, category: 'JUICES', dineInPrice: 3.5 },

  { id: 54, name: 'BARREL_SMALL', price: 3.5, category: 'BEERS',dineInPrice: 4.5 },
  { id: 56, name: 'KAISER', price: 4, category: 'BEERS', dineInPrice: 5 },
  { id: 57, name: 'RADLER', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 58, name: 'ALFA', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 59, name: 'MYTHOS', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 60, name: 'HEINEKEN', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 61, name: 'AMSTEL', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 62, name: 'CORONA', price: 5, category: 'BEERS', dineInPrice: 6 },
  { id: 63, name: 'VERGINA', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 64, name: 'VERGINA_WEISS', price: 5, category: 'BEERS', dineInPrice: 6 },
  { id: 65, name: 'VERGINA_RED', price: 5, category: 'BEERS', dineInPrice: 6 },
  { id: 66, name: 'VERGINA_ZERO', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 67, name: 'FIX_DARK', price: 3, category: 'BEERS', dineInPrice: 4 },
  { id: 68, name: 'HEINEKEN_ZERO', price: 3, category: 'BEERS', dineInPrice: 4 },

  { id: 70, name: 'DRINK_SIMPLE', price: 6, category: 'DRINKS_WINES', dineInPrice: 7 },
  { id: 71, name: 'DRINK_SPECIAL', price: 7, category: 'DRINKS_WINES', dineInPrice: 8 },
  { id: 72, name: 'DRINK_PREMIUM', price: 11, category: 'DRINKS_WINES', dineInPrice: 12 },
  { id: 73, name: 'WINE_GLASS', price: 5, category: 'DRINKS_WINES', dineInPrice: 6 },
  { id: 75, name: 'RETSINA_VASILIKI', price: 5, category: 'DRINKS_WINES', dineInPrice: 6 },
  { id: 79, name: 'LEIVADIOTI_BOTTLE', price: 5, category: 'DRINKS_WINES', dineInPrice: 6 },
  { id: 80, name: 'GORDONS_SPACE', price: 4, category: 'DRINKS_WINES', dineInPrice: 5 },
  { id: 81, name: 'PARANGA_BOTTLE', price: 25, category: 'DRINKS_WINES' },
  { id: 82, name: 'SAMAROPETRA_BOTTLE', price: 30, category: 'DRINKS_WINES' },

  { id: 83, name: 'Sex on the beach', price: 9, category: 'Cocktails', description: 'SEX_ON_THE_BEACH_DESC', dineInPrice: 10 },
  { id: 84, name: 'Caipiroska', price: 9, category: 'Cocktails', description: 'CAIPIROSKA_DESC', dineInPrice: 10 },
  { id: 85, name: 'Daiquiri', price: 9, category: 'Cocktails', description: 'DAIQUIRI_DESC', dineInPrice: 10 },
  { id: 86, name: 'Zombie', price: 9, category: 'Cocktails', description: 'ZOMBIE_DESC', dineInPrice: 10 },
  { id: 87, name: 'Mojito', price: 9, category: 'Cocktails', description: 'MOJITO_DESC', dineInPrice: 10 },
  { id: 88, name: 'Cosmopolitan', price: 9, category: 'Cocktails', description: 'COSMOPOLITAN_DESC', dineInPrice: 10 },
  { id: 89, name: 'Margarita', price: 9, category: 'Cocktails', description: 'MARGARITA_DESC', dineInPrice: 10 },
  { id: 90, name: 'Caipirinha', price: 9, category: 'Cocktails', description: 'CAIPIRINHA_DESC', dineInPrice: 10 },
  { id: 91, name: 'Negroni', price: 9, category: 'Cocktails', description: 'NEGRONI_DESC', dineInPrice: 10 },
  { id: 92, name: 'Aperol spritz', price: 9, category: 'Cocktails', description: 'APEROL_SPRITZ_DESC', dineInPrice: 10 },
  { id: 93, name: 'Mai tai', price: 9, category: 'Cocktails', description: 'MAI_TAI_DESC', dineInPrice: 10 },
  { id: 94, name: 'Long island', price: 9, category: 'Cocktails', description: 'LONG_ISLAND_DESC', dineInPrice: 10 },
  { id: 95, name: 'Pina colada', price: 9, category: 'Cocktails', description: 'PINA_COLADA_DESC', dineInPrice: 10 },
  { id: 236, name: 'Kyoto', price: 9, category: 'Cocktails', description: 'KYOTO_DESC', dineInPrice: 10 },
  { id: 96, name: 'Yuzi gun', price: 10, category: 'Cocktails', description: 'YUZI_GUN_DESC', dineInPrice: 11 },
  { id: 97, name: 'Cucu splash', price: 10, category: 'Cocktails', description: 'CUCU_SPLASH_DESC', dineInPrice: 11 },
  { id: 98, name: 'Passion paradise', price: 10, category: 'Cocktails', description: 'PASSION_PARADISE_DESC', dineInPrice: 11 },
  { id: 99, name: 'Green Apple Perfume', price: 10, category: 'Cocktails', description: 'GREEN_APPLE_PERFUME_DESC', dineInPrice: 11 },
  { id: 100, name: 'BARTENDERS_CHOICE', price: 9, category: 'Cocktails', description: 'BARTENDERS_CHOICE_DESC', dineInPrice: 10 },

  { id: 234, name: 'Mojito Green Apple', price: 6, category: 'Mocktails', description: 'MOJITO_GREEN_APPLE_DESC', dineInPrice: 7 },
  { id: 235, name: 'EL Sol', price: 6, category: 'Mocktails', description: 'EL_SOL_DESC', dineInPrice: 7 },

  // { id: 199, name: 'Family Box', price: 23.9, category: 'COMBO_OFFERS', description: 'Family_1_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/family.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/family150.webp' },
  // { id: 200, name: 'BURGER_BBQ_DOUBLE_CHEESE_SOFT_DRINKS', price: 19, category: 'COMBO_OFFERS', description: 'COMBO_OFFER_1_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/2burger.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/2burger.webp' },
  // { id: 201, name: 'HOT_DOG_X2_SWEET_CREPE', price: 12, category: 'COMBO_OFFERS', description: 'COMBO_OFFER_2_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/2hotdog.webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/2hotdog.webp' },
  // { id: 202, name: 'DOUBLE_SMASH_SOFT_DRINK_SWEET_CREPE', price: 15, category: 'COMBO_OFFERS', description: 'COMBO_OFFER_3_DESC', image: 'https://21images.s3.eu-north-1.amazonaws.com/1burger+(1).webp', thumbnailImage: 'https://21thumbnails.s3.eu-north-1.amazonaws.com/1burger+(1).webp' },
];

export const POPULAR_ITEMS = [140, 112, 145, 128, 109, 232].map(id => menuItems.find(item => item.id === id)!).filter(item => item != null);

export const SOFT_DRINKS = menuItems.filter(item => item.category === 'SOFT_DRINKS');

export const COMBO_SOFT_DRINKS = menuItems.filter(item => 
  item.category === 'SOFT_DRINKS' && 
  [15, 16, 17, 18, 19, 20, 21, 22, 24, 31].includes(item.id!)
);

export const ingredients: Array<{ name: string; price: number; selected?: boolean }> = [
  { name: 'ING_KASERI', price: 0.5 },
  { name: 'ING_ZAMBON', price: 0.5 },
  { name: 'ING_GALOPOULA', price: 0.5 },
  { name: 'ING_KOTOMPOUKIES', price: 1 },
  { name: 'ING_KASEROKROKETA', price: 1 },
  { name: 'ING_MPEIKON', price: 0.5 },
  { name: 'ING_NTOMATA', price: 0.5 },
  { name: 'ING_AVGO', price: 1 },
  { name: 'ING_FETA', price: 1 },
  { name: 'ING_MANITARIA', price: 0.5 },
  { name: 'ING_XTYPITI', price: 0.5 },
  { name: 'ING_MAYIONEZA', price: 0.5 },
  { name: 'ING_PATATAKIA', price: 1 },
  { name: 'ING_SAUCE_MOUSTARDAS', price: 0.5 },
  { name: 'ING_KAPNISTI_MPRIZOLA', price: 0.5 },
  { name: 'ING_PEPERONI', price: 0.5 },
  { name: 'ING_SALAMI_MYRAS', price: 0.5 },
  { name: 'ING_MORTADELA', price: 0.5 },
  { name: 'ING_PHILADELPHIA', price: 1 },
  { name: 'ING_PARIZA', price: 0.5 },
  { name: 'ING_KOTOPOULO', price: 1 },
  { name: 'ING_PIPERIA', price: 0.5 },
  { name: 'ING_KALAMPOKI', price: 0.5 },
  { name: 'ING_ELIES', price: 0.5 },
  { name: 'ING_ROSIKI', price: 0.5 },
  { name: 'ING_PATATES_TIGANITES', price: 1 },
  { name: 'ING_OUGAREZA', price: 0.5 },
  { name: 'ING_KIPOROU', price: 0.5 },
  { name: 'ING_PAPRIKA', price: 0.5 },
  { name: 'ING_MANOURI', price: 0.5 },
  { name: 'ING_LOUKANIKO', price: 1 },
  { name: 'ING_MELITZANOSALATA', price: 0.5 },
  { name: 'ING_SALAMI_AEROS', price: 0.5 }
];

export const sweetIngredients: Array<{ name: string; price: number; selected?: boolean }> = [
  { name: 'SWE_MERENTA', price: 0.5 },
  { name: 'SWE_NUTELLA', price: 1 },
  { name: 'SWE_MPISKOTO', price: 0.5 },
  { name: 'SWE_MPANANA', price: 0.5 },
  { name: 'SWE_LEFKI_PRAGINA', price: 0.5 },
  { name: 'SWE_BUENO_PRAGINA', price: 0.5 },
  { name: 'SWE_FRAOULA_PRAGINA', price: 0.5 },
  { name: 'SWE_MPISKOTO_OREO', price: 0.5 },
  { name: 'SWE_BUENO_KOMMATAKIA', price: 1 },
  { name: 'SWE_KARIDI', price: 0.5 },
  { name: 'SWE_FOUDOUKI', price: 0.5 },
  { name: 'SWE_AMYGDALO', price: 0.5 },
  { name: 'SWE_LILA_PAUSE', price: 1.5 },
  { name: 'SWE_MARMELADA_FRAOULA', price: 0.5 },
  { name: 'SWE_MARMELADA_RODAKINO', price: 0.5 },
  { name: 'SWE_CAPRICE', price: 1 }
];
