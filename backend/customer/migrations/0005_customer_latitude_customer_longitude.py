# Generated by Django 5.1.1 on 2024-10-24 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customer", "0004_alter_customer_email"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer",
            name="latitude",
            field=models.DecimalField(
                blank=True, decimal_places=6, max_digits=9, null=True
            ),
        ),
        migrations.AddField(
            model_name="customer",
            name="longitude",
            field=models.DecimalField(
                blank=True, decimal_places=6, max_digits=9, null=True
            ),
        ),
    ]
