# Chimney Stove Built-in Hob Service Booking Website

## Current State
A chimney service booking app exists with services: cleaning, inspection, repair. It has a customer booking page and admin dashboard with role-based auth.

## Requested Changes (Diff)

### Add
- New service types: stove repair/service, built-in hob installation/service
- Service category sections on the booking page with icons and descriptions
- Hero banner highlighting all three appliance types (chimney, stove, hob)

### Modify
- ServiceType in backend to include #stoveService and #hobService variants
- Booking form to show updated service list with descriptions
- Admin dashboard stats to reflect all 5 service types
- UI to look professional and service-oriented

### Remove
- Nothing removed

## Implementation Plan
1. Update backend ServiceType to add stoveService and hobService
2. Update getBookingStats to track all 5 types
3. Update frontend booking form with new services
4. Update admin dashboard stats display
5. Add hero section showcasing chimney, stove, hob services
