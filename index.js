const path = require('path');
const fs = require('fs');
const utils = require('loader-utils');
const yaml = require('js-yaml');

const matter = require('gray-matter');
const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
});

module.exports = function(source){
    this.cacheable && this.cacheable();
    
    // lets load the shared locals object
    let locals = this.options.locals; 

    // get which config options to load
    let loader = utils.getLoaderConfig(this, "pages");
    
    let pug = utils.getLoaderConfig(this, "pug");

    let page = matter(source);
    
    // compile content through markdown
    // divide into individual page section key/values if needed
    if (page.content) {
        // trim based on Content Sections `%% key %%` (see README)
        let content = page.content.trim().split("%%");
        
        if (content[0].length == 0){
            content.shift();
        };

        if (content.length == 1) {
            page.content = content[0];
        } 
        else {
            let i = 0;
            do {
                // this is a variable assignment
                if (content[i].trim().indexOf(" ") == -1){
                    page.data[content[i].trim()] = locals.markdown( content[i + 1] );
                    i++;
                    i++;
                } 
                else {
                    page["content"] = content[i];
                    i++;
                }                
            } while (i < content.length);
        }

        page.content = locals.markdown( page.content );
    }

    // set up the appropriate filename
    if (page.data.slug) {
        source.resourcePath = `${page.data.slug}`;
    }

    // get the associated template
    if (!page.data.template) {
        page.data.template = loader.default_template;
    }
    page.data.template_url = `${loader.template_dir}/${page.data.template}.pug`
    this.addDependency( path.resolve( page.data.template_url ) );
    page.data.template = fs.readFileSync(page.data.template_url, 'utf8')

    return page;
}
