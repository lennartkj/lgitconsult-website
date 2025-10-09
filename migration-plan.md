# Migration Plan: Contentful to Decap CMS

This document outlines the plan for migrating the LGIT Consult website from Contentful to Decap CMS and simplifying the content management approach.

## Current Architecture

The website currently uses a hybrid content management approach:

1. **Contentful Headless CMS** - Primary content source
2. **Local MDX Files** - Fallback content source
3. **API Routes** - For content delivery and search
4. **Preview Mode** - For reviewing draft content

## Migration Goals

1. Replace Contentful with Decap CMS (formerly Netlify CMS)
2. Simplify the API structure
3. Maintain all current functionality
4. Remove unnecessary code and dependencies
5. Improve developer experience

## Implementation Plan

### Phase 1: Set Up Decap CMS

- [x] Create admin directory in public folder
- [x] Create admin HTML file
- [x] Create Decap CMS configuration file
- [x] Define content models for projects, posts, and services
- [x] Create necessary content directories

### Phase 2: Simplify Content API

- [x] Create a unified content library
- [x] Implement a single content API endpoint
- [x] Update search functionality to use the new content library
- [x] Simplify preview functionality

### Phase 3: Update Data Access Layer

- [x] Create new data access functions that use local files
- [x] Update components to use the new data access layer
- [x] Remove Contentful-specific code
- [x] Update environment variables
- [x] Remove old API routes (posts, projects, services)

### Phase 4: Testing and Cleanup

- [x] Test all functionality
- [x] Remove unused dependencies
- [x] Update documentation
- [x] Clean up remaining Contentful references

## Detailed Tasks

### Phase 1: Set Up Decap CMS

#### Create Admin Directory and Files

```
public/
  admin/
    index.html
    config.yml
```

#### Define Content Models

1. **Projects**
   - id
   - title
   - description
   - fullDescription
   - challenge
   - solution
   - results
   - image
   - tags
   - slug
   - client
   - year
   - services
   - website
   - featured

2. **Posts**
   - id
   - title
   - excerpt
   - content
   - date
   - author
   - authorBio
   - authorImage
   - category
   - tags
   - slug
   - featured

3. **Services**
   - id
   - title
   - description
   - icon
   - features
   - cta

### Phase 2: Simplify Content API

#### Create Unified Content Library

Create a new file `src/lib/content.ts` that handles all content types.

#### Implement Single API Endpoint

Replace multiple API routes with a single, flexible content API:
- `src/app/api/content/route.ts`

### Phase 3: Update Data Access Layer

#### Create New Data Access Functions

Update the data access layer to use the new content library:
- `src/lib/data/index.ts`

#### Remove Contentful-Specific Code

Files to remove or update:
- `src/lib/contentful.ts`
- `src/lib/cms.ts`

### Phase 4: Testing and Cleanup

#### Test All Functionality

- Test content rendering
- Test search functionality
- Test navigation
- Test responsive design

#### Update Documentation

- Update README.md
- Add documentation for Decap CMS usage
