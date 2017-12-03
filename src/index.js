const React = require('react');
const Observable = require('mvstate');

const curry = (f) => (...args) => {
    const nrArgsRequired = f.length;
    if (args.length < nrArgsRequired) {
        return curry(f.bind(null, ...args));
    }
    return f(...args);
};
const reverse = xs => xs.slice().reverse();
const map = curry((fn, xs) => xs.map(x => fn(x)));
const map_ = curry((fn, xs) => { map(fn, xs); });
const tail = xs => xs.slice(1, xs.length);
const last = xs => xs[xs.length - 1];
const head = xs => xs[0];
const reduce = curry((f, currResult, xs) => {
    map_((x) => {
        currResult = f(currResult, x);
    }, xs);
    return currResult;
});
const compose = (...fns) => (...args) =>
    reduce((m, f) => f(m), last(fns)(...args), tail(reverse(fns)));

module.exports = curry((model, ComponentToWrap) => {
    return class WithObserver extends React.Component {
        constructor(props) {
            super(props);

            let observable = Observable.mkObservable(model);
            observable = Observable.observe(observable, (newObservable) => {
                this.setState({observable: newObservable});
            });

            this.state = {
                observable
            };
        }

        render() {
            const handle = (...fns) => () =>
                compose(head(fns), ...map(Observable.fmap, tail(fns)))(this.state.observable);
            const notify = (...fns) => () =>
                compose(Observable.notify, ...map(Observable.fmap, fns))(this.state.observable);
            const mvstateProps = {
                handle,
                notify,
                model: Observable.getModel(this.state.observable),
                observable: this.state.observable
            };

            return React.createElement(ComponentToWrap, {...this.props, mvstate: mvstateProps});
        }
    };
});
