const React = require('react');
const Observable = require('mvsplit');

const curry = (f) => (...args) => {
    const nrArgsRequired = f.length;
    if (args.length < nrArgsRequired) {
        return curry(f.bind(null, ...args));
    }
    return f(...args);
};
const map = curry((fn, xs) => xs.map(fn));
const tail = xs => xs.slice(1, xs.length);
const head = xs => xs[0];
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
            const mvsplitProps = {
                handle,
                notify,
                model: Observable.getModel(this.state.observable),
                observable: this.state.observable
            };

            return React.createElement(ComponentToWrap, {...this.props, mvsplit: mvsplitProps});
        }
    };
});
