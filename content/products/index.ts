import type { Product } from '@/lib/commerce/types';
import { ciselage, coupeChoux, etuiHorizontal, etuisCuir, fourreauxEnCuir, gravure, pierrePyrenees, pierreSynthetique, prestationAtelier } from './accessoires';
import { coffretChefOffice, couteauAFromage, gratCuisine, gratOffice } from './cuisine';
import { leBosc, leCharognard } from './fixes';
import { lAriegeois } from './l-ariegeois';
import { leCapi } from './le-capi';
import { leCathare } from './le-cathare';
import { leGrat } from './le-grat';
import { leMontagnol } from './le-montagnol';
import { lePhasme } from './le-phasme';
import { leRoques } from './le-roques';
import { lAriegeoisDeTable, leCalla, leGratDeTable, leRoquesDeTable } from './table';

/** Ordre de présentation du catalogue. */
export const products: Product[] = [
  leRoques,
  lAriegeois,
  leCathare,
  leGrat,
  leMontagnol,
  lePhasme,
  leCapi,
  lAriegeoisDeTable,
  leGratDeTable,
  leRoquesDeTable,
  leCalla,
  gratOffice,
  gratCuisine,
  couteauAFromage,
  coffretChefOffice,
  leCharognard,
  leBosc,
  fourreauxEnCuir,
  etuiHorizontal,
  etuisCuir,
  pierrePyrenees,
  pierreSynthetique,
  gravure,
  ciselage,
  prestationAtelier,
  coupeChoux,
];
