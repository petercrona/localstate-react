# Localstate-React
A React HOC that make Localstate and React a pleasure to use together

Localstate can be a bit scary, at least if you are not familiar with functors.
Localstate-React provides you with a nice little HOC that allows you to express your
React code more clearly. Let's look at an example:

``` JavaScript
// Model
export const create = () => ({counter: 1});
export const inc = ({counter}) => ({counter: counter + 1});
export const dec = ({counter}) => ({counter: counter - 1});

// Component
import {create, dec, inc} from './Model';

function Counter({_localstate: {model, notify}}) {
    return (
        <div>
            <p>
                <strong>Counter is {model.counter}</strong>
            </p>
            <p>
                <button onClick={notify(dec)}>Decrement</button>
                <button onClick={notify(inc)}>Increment</button>
                <button onClick={notify(inc, dec, inc, dec)}>Silly button</button>
            </p>
        </div>
    );
}

export default observe(create(), Counter);
```

If you used Redux, you're probably already familiar with this pattern.
"observe" will ensure that your component is updated every time notify is called.

Cheers,
Peter Crona
