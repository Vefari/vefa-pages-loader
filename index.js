'use strict'
const path = require('path')
const fs = require('fs')
const utils = require('loader-utils')
const yaml = require('js-yaml')

const matter = require('gray-matter')

module.exports = function (source) {
    this.cacheable && this.cacheable(true)
    
    // get which config options to load
    let config = utils.getOptions(this)

    // lets load the shared locals object
    if (!config.markdown) {
        config.locals.markdown = require("./plugins/markdown")
    }
    let locals = config.locals 

    const page = matter(source)
    
    if (!page.data.content) {
        page.data.content = page.content
    }
        
    // compile content through markdown
    // divide into individual page section key/values if needed
    if (page.data.content) {
        // trim based on Content Sections `%% key %%` (see README)
        const content = page.data.content.trim().split("%%");
        
        if (content[0].length == 0) {
            content.shift()
        }

        if (content.length == 1) {
            page.data.content = content[0]
        } 
        else {
            let i = 0
            do {
                // this is a variable assignment
                if (content[i].trim().indexOf(" ") == -1){
                    page.data[content[i].trim()] = locals.markdown( content[i + 1] )
                    i++
                    i++
                } 
                else {
                    page.data.content = content[i]
                    i++
                }                
            } while (i < content.length)
        }

        page.data.content = locals.markdown( page.data.content )
        page.content = ""
    }

    // set up the appropriate filename
    page.resourcePath = (page.data.slug) ? `${page.data.slug}` : `[path][name]`

    // get the associated template
    page.data.template = (page.data.template)
        ? page.data.template
        : config.config.default_template

    // for further processing by a server-side language
    page.data.template = (page.data.postprocess && page.data.postprocess.template)
        ? page.data.postprocess.template
        : page.data.template

    page.data.template_url = `${config.config.template_dir}/${page.data.template}.pug`
    this.addDependency( path.resolve( page.data.template_url ) )
    page.data.template_file = fs.readFileSync(page.data.template_url, 'utf8')
    return page
}
