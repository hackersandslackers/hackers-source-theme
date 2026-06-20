const {mergeLocales} = require('@tryghost/theme-translations/build');

const task = mergeLocales();

if (task && typeof task.then === 'function') {
    task.then(() => console.log('Locales merged')).catch(err => {
        console.error(err);
        process.exit(1);
    });
} else if (task && typeof task === 'function') {
    task(err => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Locales merged');
    });
} else {
    console.log('Locales merged');
}
