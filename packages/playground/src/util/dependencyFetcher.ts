import examplePackage from './examplePackage';

export default async (packageName: string) => {
  //   const parsedPackage = JSON.parse(examplePackage);

  //   for (const dependencyName in parsedPackage.dependencies) {
  //     const dependencyVersion = parsedPackage.dependencies[
  //       dependencyName
  //     ].replace('^', '@');

  //     const response = await fetch(
  //       `https://esm.run/${dependencyName}${dependencyVersion}`,
  //     );
  //     console.log(response);
  //     if (!response.ok) {
  //       const responseUnpkg = await fetch(
  //         `https://unpkg.com/${dependencyName}${dependencyVersion}?module`,
  //       );
  //       if (responseUnpkg.ok) return console.log(responseUnpkg);

  //       const responseSkypack = await fetch(
  //         `https://cdn.skypack.dev/${dependencyName}${dependencyVersion}`,
  //       );
  //       console.log(responseSkypack);
  //     }
  //   }

  // TODO use https://www.npmjs.com/package/cjs-es to FIX CDN ES Module issues
  // especially for 'graphql', 'graphql-tag', cache 
  // import { transform } from 'https://cdn.skypack.dev/-/cjs-es@v0.8.2-ceQTG87fHFEzTzEBy8F3/dist=es2020/cjs-es.js'

  if (['svelte-i18n', 'intl-messageformat'].indexOf(packageName) < 0) {
    try {
      const responseJsDelivr = await fetch(`https://esm.run/${packageName}`);//TODO silent 404
      if (responseJsDelivr.ok && responseJsDelivr.url) {
        const txt = await responseJsDelivr.text()
        if (txt.indexOf("Couldn't find the requested file.") < 0) {
          return responseJsDelivr.url
        }
      }
    } catch(err) {
      console.log('jsdelivr fetch error', err)
    }

    try {
      const responseUnpkg = await fetch(`https://unpkg.com/${packageName}?module`);
      if (responseUnpkg.ok && responseUnpkg.url) {
        return responseUnpkg.url
      }
    } catch(err) {
      console.log('unpkg fetch error', err)
    }
  }

  try {
    const responseSkypack = await fetch(`https://cdn.skypack.dev/${packageName}`);
    if (responseSkypack.ok && responseSkypack.url) {
      return responseSkypack.url
    }
  } catch(err) {
    console.log('skypack fetch error', err)
  }

  return null
}
