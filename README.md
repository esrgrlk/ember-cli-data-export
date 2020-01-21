ember-cli-data-export-with-style
==============================================================================

[Short description of the addon.]


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.8 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-cli-data-export-with-style
```
After installing ember-cli-data-export-with-style dependency,
you need to import following 4 javascript files directly from the imported addon such as:

```
  included: function(app) {
    this._super.included(app);
    app.import('node_modules/ember-cli-data-export-with-style/vendor/Blob.js');
    app.import('node_modules/ember-cli-data-export-with-style/vendor/FileSaver-1.3.3.js');
    app.import('node_modules/ember-cli-data-export-with-style/vendor/jszip-0.10.8.js');
    app.import('node_modules/ember-cli-data-export-with-style/vendor/xlsx.core.min.js');
  }
```


Usage
------------------------------------------------------------------------------

[Longer description of how to use the addon in apps.]


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
