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
- relationship view
- how to incorporate thumbnails?
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

#Old TODO: TODO: merge this

##next up

- entity types document
- list entitiy view of all entity types (and get rid of a bunch of redundant code)

##wishlist

- access rights
- data migration and schema versioning (if models change)
- cloud functions to cache data
- general optimization (take into account that this here is a write-heavy application)
