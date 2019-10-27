package com.example.firebase_20190925;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

public class ProfileActivity extends AppCompatActivity {
    private ImageView img_home;
    private ImageView img_finder;
    private ImageView img_download;
    private ImageView img_profile;
    private Button logoutButton;
    private Button r;
    private Button testButton;
    SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);
        img_home=findViewById(R.id.tab_home);
        logoutButton=findViewById(R.id.logoutButton);
        r=findViewById(R.id.rbutton);
        testButton=findViewById(R.id.testbutton);
        sharedPreferences = getSharedPreferences("session",MODE_PRIVATE);

        img_home.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(ProfileActivity.this,testServerActivity.class);
                startActivity(intent);
            }
        });


        logoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                sharedPreferences.edit().clear().apply();
                Intent intent = new Intent(ProfileActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
            }
        });
        r.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(ProfileActivity.this,TestActivity.class);
                startActivity(intent);

            }
        });
        testButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(ProfileActivity.this,realTestActivity.class);
                startActivity(intent);
            }
        });
    }

}
