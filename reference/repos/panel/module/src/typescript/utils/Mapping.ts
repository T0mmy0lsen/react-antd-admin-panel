/**
 *  Anything that relies on the underlying structure of the React implementation.
 */

export default class Mapping {

    $path: (value?: any) => any = () => console.log('$path: not mapped correctly');
    $loading: (value?: any) => void = () => console.log('$loading: not mapped correctly');
    $navigate: (value?: any) => any = () => console.log('$navigate: not mapped correctly');
}