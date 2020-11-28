## TODO-List Frontend

- image-upload: limit to image files (png/jpg)
- image upload: there should be a bug when using the upload on new entity mode: the create-flag will create an upload path that is wrong => test and fix
- limit upload image size or convert and optimize image via external service
- hey, how about allowing for different stories? (oh god, how did I miss that?)
- then you could import entities and so on from other users, stories you name it
- prioritize TODO_Items (meta-TODO anyone?)
- improve image support with react-dropzone
- proper input validation login screen
- try including framer motion API (for something I guess?)
- relationship menus in the Detail views
- timeline view
- allow for keyboard control (example: return after entering new property name should add the property, escape probably abort it)
- more cool loading indicator
- host website using firebase console
- editable list of tags in details view
- add confirmation modals to certain parts of the app (e.g. when creating a ne entity, the breadcrumbs can be used to leave creation - thereby deleting all progress)
- think about replacing recoil with react-query (maybe test if it works)
- define security rules (for example limited deleting dependent on properties) => find out how to do this
- editable entity type on EntityDetailView
- error boundaries, error banners, error components, error pages, error infants (maybe save the last one for later)
- add JSON export (preferably both binary/non-binary)
- the loading of entity lists is becoming slower. may have to think about continuous loading (like infinite scrolling, or fix the hook registration logic to be global)
- write documentation (no, really!)
- write tests for stuff (say whaaat?! - wasn't this supposed to be fun?)
- Ideas for additional icons: Car, plane for vehicle...
- image caching or the fetching will become expensive => local storage should be fine though
- using localStorage now - maybe call `localStorage.clear();` on logout?
- entity types are discerned by name. this makes renaming entity types a problem => would be better to discern them by id and create a map of type => id on load
- use Entities, Relationships into comtext, so they are global between views and only need to be fetched once per page load / update
- I would like the fadein to also work in the entity details. Why again isn't it working?
- copying entities and moving entities between categories might be useful
- install guide for firebase setup
- ref.update(<entity>) and ref.set(<entity>, { merge: true }) can be used with partial objects. exploiting this should be a moderate performance gain
- think about what properties the relationship cloud function really needs to track. e.g. it does not have to track the relationship array of the entites itself, so this can be optimized
- relationhips could display information when in the story they develop or disaappear. these relationship-transitions could relate to story events
- give the option of importing entity type and relationship type templates (or autoimport some of them when creating a story)
- disallow duplicate relationships on entities
- use color of relationships
- conditions for relationhips? like you can only own items and onl live in places?
- renaming an entity type leads to all the items being lost since the collection is named after the name, not the id. This should change, even if the names are convenient for development

#known bugs:

- delete icons not displayed / not visible on mobile
- updating the types does not update entities
- there seems to be some discrepancy between the local and the deployed version that leads to the entity images not being shared between them
- first time after page load when you select a character with a relationshift to another entity type (e.g. Slartibartfast and the Hitchhiker), clicking on the Hitchhiker should redirect to its detail page, but the page gets locked on loading state

#Old TODO: TODO: merge this

##next up

- entity types document
- list entitiy view of all entity types (and get rid of a bunch of redundant code)

##wishlist

- access rights
- data migration and schema versioning (if models change)
- cloud functions to cache data
- general optimization (take into account that this here is a write-heavy application)
