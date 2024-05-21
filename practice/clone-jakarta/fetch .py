import requests
from bs4 import BeautifulSoup

# Function to fetch all <a> tags from a given URL within specified <li> class
def fetch_a_tags_in_li_class(url, li_class):
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Parse the HTML content
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all <li> tags with specified class
            li_tags = soup.find_all('li', class_=li_class)
            
            # Extract <a> tags from each <li> tag
            a_tags = [li.find('a') for li in li_tags]
            
            # Filter out None values
            a_tags = [tag for tag in a_tags if tag]
            
            # Return the list of <a> tags
            return a_tags
        else:
            print("Error fetching the URL. Please check the URL and try again.")
            return []
    except Exception as e:
        print("An error occurred:", str(e))
        return []

# Input URL and <li> class from the user
url = "https://www.thejakartapost.com/"
li_class = "tjp-li-12 multimedia-arrow"  # Specific class name

# Call the function to fetch all <a> tags within specified <li> class
a_tags = fetch_a_tags_in_li_class(url, li_class)

# Print the fetched <a> tags
if a_tags:
    print("Found <a> tags within <li> class '" + li_class + "':")
    for a_tag in a_tags:
        print(a_tag)
else:
    print("No <a> tags found within <li> class '" + li_class + "'.")
