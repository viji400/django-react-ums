import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand
from users.models import User
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Loads users from an XML file into the database'

    def handle(self, *args, **options):
        # Define the path to the XML file
        xml_file_path = os.path.join(settings.BASE_DIR, 'data', 'users.xml')

        if not os.path.exists(xml_file_path):
            self.stdout.write(self.style.ERROR(f"XML file not found at {xml_file_path}"))
            return

        self.stdout.write(self.style.SUCCESS("Starting user import..."))
        
        # Clear existing users for a clean seed
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Cleared existing users."))

        # Parse the XML file
        tree = ET.parse(xml_file_path)
        root = tree.getroot()

        manager_link_data = {} # To store links for the second pass
        
        # --- PASS 1: Create all users ---
        users_created = 0
        for user_elem in root.findall('user'):
            try:
                user_id = user_elem.find('user_id').text
                name = user_elem.find('name').text
                email = user_elem.find('email').text
                title = user_elem.find('title').text
                manager_id = user_elem.find('manager_id').text

                # Use update_or_create to be safe
                user, created = User.objects.update_or_create(
                    user_id=user_id,
                    defaults={
                        'name': name,
                        'email': email,
                        'title': title,
                    }
                )
                
                if created:
                    users_created += 1

                # Store the manager relationship for later
                if manager_id:
                    manager_link_data[user_id] = manager_id

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error creating user {user_id}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"--- Pass 1 Complete: {users_created} users created ---"))

        # --- PASS 2: Link managers ---
        links_created = 0
        for user_id, manager_id in manager_link_data.items():
            try:
                user = User.objects.get(user_id=user_id)
                manager = User.objects.get(user_id=manager_id)
                
                user.manager = manager
                user.save()
                links_created += 1
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Could not link manager: User {user_id} or Manager {manager_id} not found."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error linking manager for user {user_id}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"--- Pass 2 Complete: {links_created} manager links established ---"))
        self.stdout.write(self.style.SUCCESS("User data import finished."))